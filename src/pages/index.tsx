import { Inter } from "next/font/google";
import { Button, ChakraProvider } from '@chakra-ui/react'
import RoundsTable from "@/components/RoundsTable";
import PlayersTable from "@/components/PlayersTable";
import { useState, useEffect } from 'react'
import { Round } from "@/models/Round";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [players, setPlayers] = useState(null)
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/players')
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch('/api/rounds')
      .then((res) => res.json())
      .then((data) => {
        setRounds(data)
        setLoading(false)
      })
  }, [])


  if (isLoading) return <p>Loading...</p>

  return (
    <ChakraProvider>
      <main
        className={`flex min-h-screen flex-col items-center w-full justify-between p-24 ${inter.className}`}
      >
        <PlayersTable playersData={players} />

       
        <RoundsTable roundsData={rounds} />
      </main>
    </ChakraProvider>
  );
}
