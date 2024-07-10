
export default function MediaPage() {
    return <></>;
}

export async function getServerSideProps() {
    return {
        redirect: {
            destination: "/media/images",
            permanent: false,
        },
    };
}
