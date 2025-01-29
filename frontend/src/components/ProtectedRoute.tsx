import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return (
    <>
      <SignedIn>{element}</SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/dashboard" />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
