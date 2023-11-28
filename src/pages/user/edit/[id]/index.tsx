import { getUserDetail, getUserList } from "@/apis/user";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserEdit() {
  const router = useRouter();
  const id = router.query.id as string;

  // 根据用户ID获取信息
  const [data, setData] = useState();
  useEffect(() => {
    if (id) {
      getUserDetail(id).then((res) => {
        setData(res.data);
      });
    }
  }, [id]);

  return <UserForm title="User Edit" editData={data} />;
}
