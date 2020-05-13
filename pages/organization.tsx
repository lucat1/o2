import { styled } from 'goober'
import * as React from 'react'

import { Head, SSG } from '@quercia/quercia'

import Repos from '../components/profile/repos'
import Org from '../components/profile/org'
import { Parent } from '../components/split'

import { Organization, LoggedUser } from '../types/data'

interface OrganizationProps {
  account: LoggedUser
  profile: Organization
}

const Container = styled(Parent)`
  padding: 2em 5em;

  @media (max-width: 960px) {
    padding: 2em 0;
  }
`

export default ({ profile, account }: OrganizationProps) => (
  <Container>
    <Head>
      <title>{profile?.name || 'organization'} - o2</title>
      <meta
        name='description'
        content={'the profile of ' + SSG ? 'an organization' : profile.name}
      />
    </Head>
    <Org profile={profile} />
    <Repos
      repositories={profile?.repositories}
      username={profile?.name}
      account={account}
    />
  </Container>
)
