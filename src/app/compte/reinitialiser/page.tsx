import { Suspense } from "react";
import ReinitialiserForm from "./ReinitialiserForm";

export default function ReinitialiserPage() {
  return (
    <Suspense>
      <ReinitialiserForm />
    </Suspense>
  );
}
