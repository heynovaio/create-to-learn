import React from 'react'
import Meta from './../components/Meta'
import HeroSection2 from '../components/ContentPages/HeroSection2'
import Box from '@mui/material/Box'

function AboutPage(props) {
  return (
    <Box sx={{minHeight: '50vh'}}>
      <Meta title="About" description="Learn about our company and team" />
      <HeroSection2
        bgColor="primary"
        size="large"
        title="About Create to Learn"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum consequatur numquam aliquam tenetur ad amet inventore hic beatae, quas accusantium perferendis sapiente explicabo, corporis totam!"
      />
      
    </Box>
  )
}

export default AboutPage
