import { getBorrowDetails } from "@/apis/borrow";
import BorrowForm from "@/components/BorrowForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrowAdd() {
  // get id
  const router = useRouter();

  const [data, setData] = useState();

  useEffect(() => {
    if (router.query.id) {
      getBorrowDetails(router.query.id).then((res) => {
        setData(res.data);
      });
    }
  }, [router.query.id]);

  return <BorrowForm title="Edit Borrow" editData={data} />;
}
