import { getBookDetail } from "@/apis/book";
import BookForm from "@/components/BookForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BookEdit() {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const { id } = router.query; // 获取查询id
      if (id) {
        const res = await getBookDetail(id as string);
        setData(res.data);
      }
    };
    fetch();
  }, [router]);

  return <BookForm title="Book Edit" data={data} />;
}
