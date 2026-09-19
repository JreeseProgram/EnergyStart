import { ContentLayout } from "@/components/layouts/content-layout"
import { useUser } from "@/features/auth/hooks/use-user"

type EntryProps = {
  label: string
  value: string
}
const Entry = ({ label, value }: EntryProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
    <dt className="text-sm font-medium">{label}</dt>
    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{value}</dd>
  </div>
)

const ProfileRoute = () => {
  const user = useUser()

  if (!user.data) return null

  return (
    <ContentLayout title="Profile">
      <div className="overflow-hidden p-6 shadow sm:rounded-lg">
        <div className="py-5">
          <div className="flex justify-between">
            <h3 className="text-lg leading-6 font-medium">User Information</h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm">
            Personal details of the user.
          </p>
        </div>
        <div className="border-t py-5">
          <dl className="sm:divide-y">
            <Entry label="First Name" value={user.data.firstName} />
            <Entry label="Last Name" value={user.data.lastName} />
            <Entry label="Email Address" value={user.data.email} />
            <Entry label="Role" value={user.data.role} />
            <Entry label="Bio" value={user.data.bio} />
          </dl>
        </div>
      </div>
    </ContentLayout>
  )
}

export default ProfileRoute
