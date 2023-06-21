import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EastIcon from '@mui/icons-material/East'

import { useTranslation } from 'react-i18next'

export default function MyAccountNav({
  showComponent,
  setShowComponent,
  auth,
}) {
  const { t } = useTranslation()

  //ToDo: Use constants for each of the component ids.

  const myAccountLinks = [
    {
      id: 'displayName',
      title: 'Display Name',
      userInfo: auth?.user?.displayName ?? auth.user?.name,
    },
    { id: 'email', title: 'Email', userInfo: auth?.user?.email },
    { id: 'school', title: 'School', userInfo: auth?.user?.school },
    {
      id: 'interests',
      title: 'Interests',
      userInfo: auth?.user?.interests.join(','),
    },
    {
      id: 'language',
      title: 'Language',
      userInfo: auth?.user?.language && auth?.user?.language.join(','),
    },
    {
      id: 'communities',
      title: 'Communities',
      userInfo: auth?.user?.fnmi && auth?.user?.fnmi.join(','),
    },
  ]

  return (
    showComponent === 'nav' && (
      <>
        <List
          sx={{ width: '100%'}}
          component="nav"
          aria-labelledby="settings-my-account"
        >
          {myAccountLinks.map((accLink) => (
            <ListItem
              onClick={() => {
                setShowComponent(accLink.id)
              }}
              key={accLink.title}
              secondaryAction={<ChevronRightIcon />}
            >
              <ListItemButton>
                <Grid container>
                  <Grid item xs={accLink.userInfo ? 7 : 12}>
                    <Typography>{accLink.title}</Typography>
                  </Grid>
                  {accLink.userInfo && (
                    <Grid item xs={5}>
                      <Typography noWrap> {accLink.userInfo}</Typography>
                    </Grid>
                  )}
                </Grid>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem>
            <ListItemButton
              onClick={() => {
                setShowComponent('deleteAccount')
              }}
            >
              <ListItemText>{t('settings.delete-account')}</ListItemText>
              <EastIcon />
            </ListItemButton>
          </ListItem>
        </List>
      </>
    )
  )
}
