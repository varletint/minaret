### User Input

wirte me documentaion for the api endpoint so that i work on the frontend.

for example refreshtoken (cookies) with origen request retry for and remember ibe using axios with interceptor

api.interceptors.request.use(
(config: InternalAxiosRequestConfig) => {
if (accessToken) {
config.headers.Authorization = `Bearer ${accessToken}`;
}

    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;

},
(error) => Promise.reject(error)
);

api.interceptors.response.use(
(response) => {
if (response.data?.data?.accessToken) {
setAccessToken(response.data.data.accessToken);
}
return response;
},
async (error) => {
const originalRequest = error.config;

    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh");
        console.log("Refresh Response:", response);

        const { accessToken: newAccessToken } = response.data.data;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        // Important: Don't redirect if it's just the initial check failing
        // Let the AuthContext handle the null user state
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);

}
);

do u thing i should use getCsrfToken()

### Planner Response

I'll create comprehensive API documentation for your frontend. First, let me answer your CSRF question:

**Regarding CSRF tokens:** Your backend currently **doesn't implement CSRF protection**, so you can remove `getCsrfToken()` for now. CSRF protection is typically needed when cookies are used for authentication. Since you're using:

- **Access tokens** via `Authorization` header (not vulnerable to CSRF)
- **Refresh tokens** via httpOnly cookies (potentially vulnerable, but the `/refresh` endpoint only returns a new access token, not sensitive data)

Your current setup is reasonably secure. You could add CSRF protection later if needed, but it's not critical for this architecture.

Now let me create the API documentation:

_Edited relevant file_

### Planner Response

I've created comprehensive API documentation for you! Here's a summary:

**About CSRF:** You can **remove `getCsrfToken()`** from your interceptor - your backend doesn't implement it, and your JWT architecture doesn't really need it since access tokens are sent via headers, not cookies.

**Key points from the documentation:**

1. **Your Axios setup is correct!** Just make sure you have `withCredentials: true` in your axios instance to send cookies.

2. **Simplified interceptor** - I removed the CSRF part:

   ```typescript
   api.interceptors.request.use((config) => {
     if (accessToken) {
       config.headers.Authorization = `Bearer ${accessToken}`;
     }
     return config;
   });
   ```

3. **All endpoints documented** - Auth (register, login, refresh, logout, /me), Stations (CRUD + broadcasting), Shows (CRUD + scheduling)

4. **Auth flow diagram** - Visual representation of login → request → refresh cycle

Would you like me to also save this documentation to your project folder (like `docs/API.md`) so it stays with your codebase?

### User Input

yes

_Edited relevant file_

### Planner Response

Done! Created [docs/API.md](cci:7://file:///c:/Users/hp/Projects/backends/js/minaret-backend/docs/API.md:0:0-0:0) in your project with the complete API documentation. You can now reference it while building your frontend! 📚
