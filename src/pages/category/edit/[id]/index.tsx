import { getCategoryDetail } from "@/apis/category";
import CategoryForm from "@/components/CategoryForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryEdit() {
  const router = useRouter();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const { id } = router.query;
      if (id) {
        const res = await getCategoryDetail(id as string);
        setData(res.data);
      }
    };
    fetch();
  }, [router]);

  return <CategoryForm title="Edit Category" data={data} />;
}
