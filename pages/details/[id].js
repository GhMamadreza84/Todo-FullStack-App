import Link from "next/link";
import DetailsTodoPage from "../../components/template/DetailsTodoPage";

const DetailsTodo = ({ id }) => {
  return <DetailsTodoPage id={id} />;
};

export default DetailsTodo;

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: { id },
  };
}
