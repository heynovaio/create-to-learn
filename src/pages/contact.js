import React from 'react'
import Meta from './../components/Meta'
import ContactSection from '../components/ContentPages/ContactSection'

function ContactPage(props) {
  return (
    <>
      <Meta 
        title="Contact - Create to Learn" />
      <ContactSection
        bgColor="default"
        size="large"
        bgImage=""
        bgImageOpacity={1}
        title="Contact Us"
        subtitle=""
        buttonText="Send message"
        buttonColor="primary"
        showNameField={true}
      />
    </>
  )
}

export default ContactPage
