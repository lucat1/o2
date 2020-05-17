import * as React from 'react'
import { Head, SSG } from '@quercia/quercia'

import { Parent } from '../components/split'
import Repos from '../components/profile/repos'
import Org from '../components/profile/org'

import { Organization, Base } from '../types/data'

export default ({ profile, account }: Base<{ profile: Organization }>) => (
  <Parent p={['2rem 0', '2rem 5rem']}>
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
      owner={profile?.name}
      account={account}
    />
  </Parent>
)
