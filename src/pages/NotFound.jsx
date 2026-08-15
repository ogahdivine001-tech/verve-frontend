import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-8xl text-warm-grey-dark mb-4">404</p>
      <h1 className="font-display text-2xl mb-3">Page Not Found</h1>
      <p className="text-sm text-ink-soft/60 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
        <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
