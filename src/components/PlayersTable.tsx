import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { Player } from '@/models/Player'

interface PlayersTableProps {
  playersData: Player[] | null;
}

function RoundsTable({ playersData }: PlayersTableProps) {
  if(playersData)
  playersData.sort((a, b) => a.rank - b.rank);
  console.log('====================================');
  console.log(playersData);
  console.log('====================================');
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th isNumeric>RANK</Th>
            <Th>PLAYER NAME</Th>
            <Th isNumeric>PRIMARY POINT</Th>
            <Th isNumeric>SECONDARY POINT</Th>
          </Tr>
        </Thead>
        <Tbody>
          {playersData ?
            playersData?.map((player,index) => (
              <Tr key={index}>
                <Td>{player.rank}</Td>
                <Td>{player.first_name + " " + player.last_name}</Td>
                <Td isNumeric>{player.roundPrimaryPoints}</Td>
                <Td isNumeric>{player.roundSecondaryPoints}</Td>
              </Tr>
            )) : null
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RoundsTable