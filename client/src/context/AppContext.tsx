import { createContext } from "react";
import type { ReactNode } from "react";

interface AppContextType {
  appName: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppContext.Provider value={{ appName: "Cohort App" }}>
      {children}
    </AppContext.Provider>
  );
};

// ### The accurate version is:

// > **Context defines the container, and `.Provider` injects the value into that container for a specific part of the component tree.**

// That distinction matters later.

// ---

// ## Precise mental model (keep this)

// ### 1️⃣ Context = container definition (empty by default)

// ```ts
// const AppContext = createContext(null);
// ```

// This:

// * defines **what kind of data** can live there
// * does **not** store data itself

// Think: **empty box blueprint**

// ---

// ### 2️⃣ Provider = fills the container

// ```tsx
// <AppContext.Provider value={...}>
// ```

// This:

// * **fills** the context with data
// * only for components **inside** it

// Think: **putting items into the box**

// ---

// ### 3️⃣ Components = readers

// ```ts
// useContext(AppContext)
// ```

// This:

// * reads whatever was put into the box
// * cannot modify unless you expose functions

// Think: **opening the box and looking inside**

// ---

// ## Important correction (subtle but crucial)

// ❌ Provider does **not** push value globally
// ✅ Provider scopes the value to its children
