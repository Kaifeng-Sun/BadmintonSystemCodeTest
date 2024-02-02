import { Match } from "@/models/Match";
import { Player } from "@/models/Player";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Button, Select, ModalFooter } from "@chakra-ui/react";
import { match } from "assert";
import { Formik, FormikProps, Form, FieldArray, Field, FieldProps, useFormikContext } from "formik";
import { Input } from '@chakra-ui/react';
import React from 'react'
import { FormValues, RoundsTableData } from "./RoundsTable";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: RoundsTableData;
}

function MatchUpdateModal({ isOpen, onClose, match }: MatchModalProps) {
  return (
    <Modal onClose={onClose} size='sm' isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              games: [{
                game_number: 1,
                player1_score: 0,
                player2_score: 0
              }, {
                game_number: 2,
                player1_score: 0,
                player2_score: 0
              }],
              winner: '',
            }}
            onSubmit={async (values) => {
              const winnerFirstName = values.winner.split(' ')[0]
              const winnerLastName = values.winner.split(' ')[1]
              const response = await fetch('/api/players');
              const players = await response.json();
              const matchingPlayer = players.find((player: Player) =>
                player.first_name === winnerFirstName && player.last_name === winnerLastName
              );
              if (matchingPlayer) {
                const winnerId = matchingPlayer._id;
                await fetch(`/api/matches/${match.matchId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ ...values, winner: winnerId })
                }).catch(error => console.error('Error:', error));
              } else {
                return null;
              }
            }}
          >
            {(props: FormikProps<FormValues>) => {
              return (
                <Form>
                  <FieldArray name="games">
                    {({ remove, push }) => (
                      <div>
                        {props.values.games.length > 0 &&
                          props.values.games.map((game, index) => (
                            <div key={index}>
                              <h3>Enter Game {game.game_number} Result</h3>
                              <Field name={`games[${index}].player1_score`} placeholder="Player 1 Score">
                                {({ field }: FieldProps<string, FormValues>) => (
                                  <FormControl>
                                    <FormLabel>Player 1</FormLabel>
                                    <Input {...field} type="number"
                                      min="0"
                                      max="30" />
                                  </FormControl>
                                )}
                              </Field>
                              <Field name={`games[${index}].player2_score`} placeholder="Player 2 Score">
                                {({ field }: FieldProps<string, FormValues>) => (
                                  <FormControl>
                                    <FormLabel>Player 2</FormLabel>
                                    <Input {...field} type="number"
                                      min="0"
                                      max="30" />
                                  </FormControl>
                                )}
                              </Field>

                            </div>
                          ))}
                        {props.values.games.length === 3 ? <Button onClick={() => remove(props.values.games.length - 1)}>Remove The Third Game</Button> : null}
                        {(props.values.games.length == 2) ?
                          <Button onClick={() => push({ game_number: props.values.games.length + 1, player1_score: 0, player2_score: 0 })}>
                            Add The Third Game
                          </Button>
                          : null}
                      </div>
                    )}
                  </FieldArray>
                  <Field name='winner' placeholder="Winner Name" as="select">
                          <option value={match.player1Name}>{match.player1Name}</option>
                          <option value={match.player2Name}>{match.player2Name}</option>
                  </Field>

                  <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Submit
                  </Button>
                </Form>
              )
            }}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MatchUpdateModal
