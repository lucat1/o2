import { styled } from 'goober'
import * as React from 'react'
import format from 'tinydate'

import { navigate, SSG } from '@quercia/quercia'

import { Commit as ICommit } from '../../types/data'
import I from '../image'
import Container from '../base'
import S from '../skeleton'
import { Link, P } from '../typography'

const CommitContainer = styled(Container)`
  margin: 0.5em 0;
  padding: 0.35em 0.75em;
  height: 3.5em;

  white-space: nowrap;
  overflow: hidden;

  display: flex;
  align-items: center;
`

const Image = styled(I)`
  flex-shrink: 0;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  transition: box-shadow 200ms ease-in-out;

  img {
    border-radius: 50%;
    pointer-events: none;
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.4);
  }
`

const Data = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  flex-shrink: 1;
  margin: 0 0.5em;

  overflow: hidden;
`

const WhiteLink = styled(Link)`
  color: var(--fg-5);
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`

const Skeleton = S

const TinyP = styled(P)`
  margin: 0;
  font-size: 0.85em;
`

const TinyPSkeleton = styled('p')`
  margin: 0;
  font-size: 0.85em;
`

const Right = styled('div')`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

const Commit: React.FunctionComponent<{ commit: ICommit; base: string }> = ({
  commit,
  base
}) => (
  <CommitContainer>
    <Image
      alt={
        commit
          ? `${commit.author.username}'s profile picture`
          : "commit author's profile picture"
      }
      src={commit ? `${commit.author.picture}?s=75` : ''}
      tabIndex={0}
      onClick={() => navigate(`/${commit.author.username}`)}
      onKeyUp={e => e.keyCode === 13 && navigate(`/${commit.author.username}`)}
    />
    <Data>
      <WhiteLink to={`${base}/commit/${commit?.commit}`}>
        {commit?.subject}
      </WhiteLink>
      {SSG ? (
        <TinyPSkeleton>
          <Skeleton height={1.1} width={12} />
        </TinyPSkeleton>
      ) : (
        <TinyP>
          <Link to={`/${commit?.author.username}`}>
            {commit?.author?.username}
          </Link>
          {' commited on '}
          {format('{DD} {MM} {YYYY}')(new Date(commit?.author?.date))}
        </TinyP>
      )}
    </Data>
    <Right>
      <Link to={`${base}/tree/${commit?.tree}`}>{commit?.abbrv_tree}</Link>
    </Right>
  </CommitContainer>
)

export default Commit
