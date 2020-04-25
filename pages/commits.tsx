import * as React from 'react'
import { Head, usePrerender } from '@quercia/quercia'
import { styled } from 'goober'
import format from 'tinydate'

import Layout from '../components/repository/layout'
import Container from '../components/repository/container'

import { Repository, Commit } from '../types/data'
import { SpacedP, Link, SpacedLink } from '../components/typography'
import _Image from '../components/image'
import _Skeleton from '../components/skeleton'

export interface CommitsProps {
  repository: Repository
  commits: Commit[]
}

const CommitContainer = styled(Container)`
  margin: 0.75em 0;
  padding: 0.5em;

  display: flex;
  align-items: center;
`

const Image = styled(_Image)`
  width: 2em;
  height: 2em;
  border-radius: 50%;
`

const WhiteLink = styled(SpacedLink)`
  color: var(--fg-5);

  &:hover {
    text-decoration: underline;
  }
`

const Skeleton = styled(_Skeleton)`
  margin: 0 0.5em;
`

const TinyP = styled(SpacedP)`
  font-size: 0.85em;
`

const Right = styled('div')`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

export default ({ repository, commits }: CommitsProps) => {
  if (usePrerender()) {
    commits = Array.from({ length: 10 })
  }

  const base = `/${repository?.owner}/${repository?.name}`

  return (
    <>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' commits'}- o2
        </title>
        <meta
          name='description'
          content='the commits of a git repository on the o2 service'
        />
      </Head>
      <Layout repository={repository} page='Commits'>
        {(commits || []).map(commit => (
          <CommitContainer key={commit?.commit}>
            <Image src={commit ? `${commit.author.picture}?s=75` : ''} />
            <div>
              <WhiteLink to={`${base}/commit/${commit?.commit}`}>
                {commit?.subject}
              </WhiteLink>
              {usePrerender() ? (
                <Skeleton height={1} width={12} />
              ) : (
                <TinyP>
                  <Link to={`/${commit?.author.username}`}>
                    {commit?.author?.username}
                  </Link>
                  {' commited on '}
                  {format('{DD} {MM} {YYYY}')(new Date(commit?.author?.date))}
                </TinyP>
              )}
            </div>
            <Right>
              <Link to={`${base}/tree/${commit?.tree}`}>
                {commit?.abbrv_tree}
              </Link>
            </Right>
          </CommitContainer>
        ))}
      </Layout>
    </>
  )
}
