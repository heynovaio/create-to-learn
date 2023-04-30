import React from 'react'
import Container from '@mui/material/Container'
import Section from './Section'

function CreatorSection({ data }) {
  return (
    <Section>
      <Container>{data.uid}</Container>
    </Section>
  )
}

export default CreatorSection
