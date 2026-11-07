import Axios, { type InternalAxiosRequestConfig } from "axios"
import { LoginRequiredError } from "@workos-inc/authkit-react"

import { env } from "@/config/env"
import { toast } from "@/components/ui/toast"

type AuthenticationProvider = {
  getAccessToken: () => Promise<string>
  signIn: () => Promise<unknown>
}

let tokenProvider: AuthenticationProvider | undefined
let sessionToastId: string | undefined

function dismissSessionToast() {
  if (sessionToastId) {
    toast.close(sessionToastId)
    sessionToastId = undefined
  }
}

export function registerAccessTokenGetter(provider: AuthenticationProvider) {
  // Give each registration its own identity, including Strict Mode remounts.
  const registration = { ...provider }
  tokenProvider = registration

  return () => {
    if (tokenProvider === registration) {
      tokenProvider = undefined
      dismissSessionToast()
    }
  }
}

class AuthenticationNotReadyError extends Error {}
class TokenRetrievalError extends Error {}

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const provider = tokenProvider
  if (!provider) {
    throw new AuthenticationNotReadyError()
  }

  let token: string
  try {
    token = await provider.getAccessToken()
  } catch (error) {
    if (config.signal?.aborted || tokenProvider !== provider) {
      throw new Axios.CanceledError()
    }
    if (error instanceof LoginRequiredError || Axios.isCancel(error)) {
      throw error
    }
    throw new TokenRetrievalError("Unable to retrieve access token", {
      cause: error,
    })
  }

  if (config.signal?.aborted || tokenProvider !== provider) {
    throw new Axios.CanceledError()
  }
  if (!token) throw new LoginRequiredError()

  config.headers.set("Authorization", `Bearer ${token}`)
  config.headers.set("Accept", "application/json")
  config.withCredentials = true
  return config
}

function showSessionExpired() {
  if (sessionToastId) return

  const id = toast.add({
    type: "error",
    title: "Session expired",
    description: "Your session has expired. Please sign in again.",
    timeout: 0,
    onClose: () => {
      if (sessionToastId === id) sessionToastId = undefined
    },
    actionProps: {
      children: "Sign in",
      onClick: () => {
        const provider = tokenProvider
        if (!provider) {
          toast.add({
            type: "error",
            title: "Sign-in unavailable",
            description: "Authentication is not ready. Please try again.",
          })
          return
        }
        void provider.signIn().catch(() => {
          toast.add({
            type: "error",
            title: "Unable to sign in",
            description: "Unable to start sign-in. Please try again.",
          })
        })
      },
    },
  })
  sessionToastId = id
}

export const api = Axios.create({
  baseURL: env.API_URL,
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    if (Axios.isCancel(error)) return Promise.reject(error)

    const status = Axios.isAxiosError(error) ? error.response?.status : undefined
    if (error instanceof LoginRequiredError || status === 401) {
      showSessionExpired()
      return Promise.reject(error)
    }

    let message = "The request could not be completed. Please try again."
    if (error instanceof AuthenticationNotReadyError) {
      message = "Authentication is not ready. Please try again."
    } else if (error instanceof TokenRetrievalError) {
      message = "Unable to verify your session right now. Please try again."
    } else if (status === 403) {
      message = "You don’t have permission to perform this action."
    } else if (status !== undefined && status >= 500) {
      message = "Something went wrong on the server. Please try again."
    } else if (Axios.isAxiosError(error) && !error.response) {
      message = "Unable to reach the server. Check your connection and try again."
    } else if (Axios.isAxiosError(error)) {
      const serverMessage: unknown = error.response?.data?.message
      if (typeof serverMessage === "string" && serverMessage.trim()) {
        message = serverMessage
      }
    }

    toast.add({ type: "error", title: "Request failed", description: message })
    return Promise.reject(error)
  }
)
