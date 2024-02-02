import React, { useEffect, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Select,
  Td,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { Round } from '@/models/Round';
import { Game, Match } from '@/models/Match';
import { Player } from '@/models/Player';
import MatchUpdateModal from './MatchUpdateModal';

interface RoundsTableProps {
  roundsData: Round[];
}

export interface RoundsTableData {
  player1Name: string;
  player2Name: string;
  winner: string;
  games: string;
  matchId: string;
}

export interface FormValues {
  games: Game[];
  winner: string;
}

function RoundsTable({ roundsData }: RoundsTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const maxRoundNumber = roundsData.length > 0
  ? Math.max(...roundsData.map(round => round.round_number))
  : 0;
  
  const options = Array.from({ length: maxRoundNumber }, (_, i) => maxRoundNumber - i);
  const [roundNumber, setRoundNumber] = useState<number>(maxRoundNumber);
  const [roundData, setRoundData] = useState(roundsData.find(round => round.round_number === maxRoundNumber));
  const [currentTableData, setCurrentTableData] = useState<RoundsTableData[]>()
  const [selectedMatch, setSelectedMatch] = useState<RoundsTableData>();
  const [isRoundCompleted, setIsRoundCompleted] = useState(false)

  const handleNewRoundClick = async () => {
    await fetch('/api/rounds', { method: 'POST' })
    await fetch('/api/rounds')
      .then((res) => res.json())
      .then((data) => {
        setIsRoundCompleted(false)
        setRoundData(data.find((round: { round_number: number; }) => round.round_number === maxRoundNumber))
      })
    setRoundNumber(roundNumber + 1)
  }

  useEffect(() => {
    setRoundData(roundsData.find(round => round.round_number === roundNumber))
  }, [roundNumber])

  useEffect(() => {
    const fetchData = async () => {
      if (!roundData?.matches) {
        setCurrentTableData([]);
        return;
      }

      const tempTableDataPromises = roundData.matches.map(async (matchId) => {
        const match = await fetch(`/api/matches/${matchId}`).then((res) => res.json());
        const player1: Player = await fetch(`/api/players/${match.player1}`).then((res) => res.json())
        const player2: Player = await fetch(`/api/players/${match.player2}`).then((res) => res.json())
        const winner: Player | null = match.winner ? await fetch(`/api/players/${match.winner}`).then((res) => res.json()) : null;
        const games: Game[] = match.games;

        return {
          player1Name: player1.first_name + " " + player1.last_name,
          player2Name: player2.first_name + " " + player2.last_name,
          winner: winner ? winner.first_name + winner.last_name : "NOT COMPLETED",
          games: match.games ? games.map(game => game.player1_score + ":" + game.player2_score).join(" ") : "NOT COMPLETED",
          matchId: matchId,
        };
      });

      const tempTableData = await Promise.all(tempTableDataPromises);
      setCurrentTableData(tempTableData);
    };

    const checkIsRoundsCompleted = async () => {
      const allMatches: Match[] = await fetch('/api/matches').then((res) => res.json());
      return setIsRoundCompleted(allMatches.every(match => match.isCompleted === true));
    }
    fetchData();
    checkIsRoundsCompleted();
  }, [roundData, isOpen]);



  return (
    <>
      <Button
        onClick={() => handleNewRoundClick()}
        isDisabled={!isRoundCompleted}
      >
        Create a new ROUND
      </Button>

      <TableContainer>
        <Table variant='simple'>
          <TableCaption>
            <Select placeholder='Select round' defaultValue={roundNumber} onChange={(e) => setRoundNumber(Number(e.target.value))}>
              {options.map((option, index) => (
                <option key={index} value={option}>{`Round ${option}`}</option>
              ))}
            </Select>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>PLAYER 1</Th>
              <Th>PLAYER 2</Th>
              <Th>WINNER</Th>
              <Th>GAMES</Th>
              <Th>OPERATIONS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentTableData ?
              currentTableData.map((match, index) => {
                return (
                  <Tr key={index}>
                    <Td>{match.player1Name}</Td>
                    <Td>{match.player2Name}</Td>
                    <Td>{match.winner}</Td>
                    <Td>{match.games}</Td>
                    <Td>
                      <Button onClick={() => {
                        setSelectedMatch(match)
                        onOpen();
                      }}>Update Result</Button>
                    </Td>
                  </Tr>
                )
              }) : null
            }
          </Tbody>
        </Table>
        {selectedMatch && (
          <MatchUpdateModal
            isOpen={isOpen}
            onClose={onClose}
            match={selectedMatch}
          />
        )}
      </TableContainer>
    </>

  )
}

export default RoundsTable