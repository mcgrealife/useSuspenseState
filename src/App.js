import "./styles.css";
import { useState, Suspense } from "react";

function App() {
  // allows us to check the status of the promise
  function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
      (response) => {
        status = "success";
        result = response;
      },
      (error) => {
        status = "error";
        result = error;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      }
    };
  }
  // resolve promise by state
  const [state, setState] = useState(false);

  // artificially setting state
  setTimeout(() => {
    setState(true);
  }, 5000);

  return (
    <>
      <Suspense
        fallback={
          <>
            <h1>Promise thrown</h1>
            <h2>Showing Suspense fallback</h2>
          </>
        }
      >
        <Data
          wrappedPromise={wrapPromise(
            new Promise((resolve) => {
              state && resolve();
            })
          )}
        />
      </Suspense>
    </>
  );
}

function Data({ wrappedPromise }) {
  wrappedPromise.read();
  return <h1>Promise resolved</h1>;
}

export default App;
