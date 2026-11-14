package com.energystart.prod;

import com.energystart.prod.controller.EnergyReportController;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import com.energystart.prod.service.EnergyReportService;
import com.energystart.prod.service.PropertyService;
import com.energystart.prod.service.WorkOsUserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EnergyReportAuthorizationTests {
    private final EnergyReportService reports = mock(EnergyReportService.class);
    private final PropertyRepo properties = mock(PropertyRepo.class);
    private final EnergyReportController controller = new EnergyReportController(
            reports, new PropertyService(properties, mock(WorkOsUserService.class)));
    private final Jwt jwt = Jwt.withTokenValue("test").header("alg", "none")
            .subject("user_owner").build();

    private EnergyReport report(String propertyId) {
        EnergyReport report = new EnergyReport();
        report.setRelatedPropertyID(propertyId);
        return report;
    }

    private Property property(String id, String userId) {
        Property property = new Property();
        property.setId(id);
        property.setAuthorizedUserIds(List.of(userId));
        return property;
    }

    private void allow(String id) {
        when(properties.findByIdAndAuthorizedUserIdsContaining(id, "user_owner"))
                .thenReturn(Optional.of(property(id, "user_owner")));
    }

    private void deny(String id) {
        when(properties.existsById(id)).thenReturn(true);
    }

    private void forbidden(Runnable action) {
        assertEquals(HttpStatus.FORBIDDEN,
                assertThrows(ResponseStatusException.class, action::run).getStatusCode());
    }

    @Test
    void collectionOnlyIncludesAccessibleProperties() {
        when(properties.findAll()).thenReturn(List.of(
                property("owned", "user_owner"), property("private", "user_other")));
        EnergyReport owned = report("owned");
        when(reports.getAllReports()).thenReturn(List.of(
                report("private"), owned, report("deleted")));
        assertEquals(List.of(owned), controller.getAllReports(jwt).getBody());
    }

    @Test
    void privateReportCannotBeReadUpdatedOrDeleted() {
        when(reports.getReportById("report")).thenReturn(Optional.of(report("private")));
        deny("private");
        allow("owned");
        EnergyReport replacement = report("owned");
        forbidden(() -> controller.getReportById("report", jwt));
        forbidden(() -> controller.updateReport("report", replacement, jwt));
        forbidden(() -> controller.deleteReport("report", jwt));
        verify(reports, never()).updateReport(anyString(), any());
        verify(reports, never()).deleteReport(anyString());
    }

    @Test
    void cannotCreateInAnotherUsersProperty() {
        deny("private");
        forbidden(() -> controller.createReport(report("private"), jwt));
        verify(reports, never()).createReport(any());
    }

    @Test
    void cannotMoveOwnedReportIntoAnotherUsersProperty() {
        allow("owned");
        deny("private");
        when(reports.getReportById("report")).thenReturn(Optional.of(report("owned")));
        forbidden(() -> controller.updateReport("report", report("private"), jwt));
        verify(reports, never()).updateReport(anyString(), any());
    }

    @Test
    void authorizedCrudStillWorksIncludingMoveBetweenAccessibleProperties() {
        allow("owned");
        allow("shared");
        EnergyReport original = report("owned");
        EnergyReport replacement = report("shared");
        when(reports.createReport(original)).thenReturn(original);
        when(reports.getReportById("report")).thenReturn(Optional.of(original));
        when(reports.updateReport("report", replacement)).thenReturn(Optional.of(replacement));
        when(reports.deleteReport("report")).thenReturn(true);
        assertEquals(HttpStatus.CREATED, controller.createReport(original, jwt).getStatusCode());
        assertSame(original, controller.getReportById("report", jwt).getBody());
        assertSame(replacement, controller.updateReport("report", replacement, jwt).getBody());
        assertEquals(HttpStatus.NO_CONTENT, controller.deleteReport("report", jwt).getStatusCode());
    }

    @Test
    void missingReportsRemainNotFound() {
        assertEquals(HttpStatus.NOT_FOUND, controller.getReportById("missing", jwt).getStatusCode());
        assertEquals(HttpStatus.NOT_FOUND, assertThrows(ResponseStatusException.class,
                () -> controller.updateReport("missing", report("owned"), jwt)).getStatusCode());
        assertEquals(HttpStatus.NOT_FOUND, assertThrows(ResponseStatusException.class,
                () -> controller.deleteReport("missing", jwt)).getStatusCode());
        verify(reports, never()).updateReport(anyString(), any());
        verify(reports, never()).deleteReport(anyString());
    }

    @Test
    void missingAuthenticationBlocksEveryEndpointBeforeDataAccess() {
        List<Runnable> actions = List.of(
                () -> controller.getAllReports(null),
                () -> controller.getReportById("report", null),
                () -> controller.createReport(report("owned"), null),
                () -> controller.updateReport("report", report("owned"), null),
                () -> controller.deleteReport("report", null));
        for (Runnable action : actions) {
            assertEquals(HttpStatus.UNAUTHORIZED,
                    assertThrows(ResponseStatusException.class, action::run).getStatusCode());
        }
        verifyNoInteractions(reports, properties);
    }
}
