import { getBorrowDetails } from "@/apis/borrow";
import BorrowForm from "@/components/BorrowForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BorrowBook: React.FC<any> = () => {
  // get id
  const router = useRouter();

  const [data, setData] = useState();

  useEffect(() => {
    if (router.query.id) {
      getBorrowDetails(router.query.id as string).then((res) => {
        setData(res.data);
      });
    }
  }, [router.query.id]);

  return <BorrowForm title="Edit Borrow" editData={data} />;
};

export default BorrowBook;
