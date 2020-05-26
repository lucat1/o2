import * as React from 'react'

import { Head } from '@quercia/quercia'

import Layout from '../../components/repository/layout'
import Left from '../../components/settings/left'
import { Parent, Right } from '../../components/split'

import { Repository } from '../../types/repository'

export interface SettingsProps {
  repository: Repository
  owns: boolean
}

export default ({ repository, owns }: SettingsProps) => {
  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : 'unkown'}{' '}
          settings - o2
        </title>
        <meta
          name='description'
          content='the settings of a git repository on the o2 service'
        />
      </Head>
      <Layout owns={owns} repository={repository} page='Settings'>
        <Parent py={6}>
          <Left repository={repository} current='General' />
          <Right>right hand side</Right>
        </Parent>
      </Layout>
    </>
  )
}
