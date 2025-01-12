import React from "react";
import ProfilePage from "../components/template/ProfilePage";
import { getSession } from "next-auth/react";

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }else {
    return {
      props:{}
    }
  }
}
