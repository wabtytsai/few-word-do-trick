import { useParams, useRouter } from "next/navigation";
import { PARAM_LOBBY_ID } from "../constants";
import { Button, Popover, Text, Title } from "@mantine/core";
import { useSocket } from "@client/app/contexts/socket-context";
import { ClientEvents } from "@shared/client/ClientEvents";

type Props = {
    waitingRoom: string[],
}

export default function Header({ waitingRoom }: Props) {
    const router = useRouter();
    const socket = useSocket();
    const lobbyID = useParams()[PARAM_LOBBY_ID] as string;

    const onLeaveLobby = () => {
        router.back();
    }

    const onShuffleTeam = () => {
        socket.emit(ClientEvents.GameShuffleTeam);
    }

    return (
        <div className='header'>
            <div className='header-title'>
                <Title order={3}>
                    Few Word Do Trick
                </Title>
            </div>
            <div className='header-menu'>
                <Popover width={200} position="bottom" shadow="md" radius="md">
                    <Popover.Target>
                        <Button
                            className='header-popover-players-button'
                            variant='default'
                            radius="xl"
                            size="xs"
                        >
                            Room
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <div className='header-popover'>
                            <div className='header-lobby-id'>
                                <Text size={14} fw={700}>Room: </Text>
                                <Text size={14}>{lobbyID}</Text>
                            </div>
                            <div className='header-popover-players-list'>
                                <Text size={14}>Players in this room</Text>
                                {waitingRoom.map((player, idx) => {
                                    return <Text key={player + idx} size={8}>{player}</Text>;
                                })}
                            </div>
                            <Button
                                className='header-shuffle-team-button'
                                onClick={onShuffleTeam}
                                variant='outline'
                                color="dark"
                                radius="xl"
                                size="xs"
                            >
                                Shuffle Team
                            </Button>
                        </div>
                    </Popover.Dropdown>
                </Popover>
                <Button
                    className='header-leave-lobby-button'
                    onClick={onLeaveLobby}
                    variant='outline'
                    color="red"
                    radius="xl"
                    size="xs"
                >
                    Leave
                </Button>
            </div>
        </div>
    )
}