import { useParams, useRouter } from "next/navigation";
import { PARAM_LOBBY_ID } from "../constants";
import { Button, Text, Title } from "@mantine/core";

export default function Header() {
    const router = useRouter();
    const lobbyID = useParams()[PARAM_LOBBY_ID] as string;

    const onLeaveLobby = () => {
        router.back();
    }

    return (
        <div className='header'>
            <div className='header-title'>
                <Title order={3}>
                    Few Word Do Trick
                </Title>
            </div>
            <div className='header-menu'>
                <div className='header-lobby-id'>
                    <Text fw={700}>Room: </Text>
                    <Text>{lobbyID}</Text>
                </div>
                <Button
                    className='header-leave-lobby-button'
                    onClick={onLeaveLobby}
                    variant='outline'
                    color="dark"
                    radius="xl"
                    size="xs"
                >
                    Leave
                </Button>
            </div>
        </div>
    )
}