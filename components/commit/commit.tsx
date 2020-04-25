import * as React from 'react'
import { usePrerender } from '@quercia/quercia'
import { styled } from 'goober'
import format from 'tinydate'

import Container from '../repository/container'

import { SpacedP, Link, SpacedLink } from '../typography'
import _Image from '../image'
import _Skeleton from '../skeleton'

import { Commit as ICommit } from '../../types/data'

const CommitContainer = styled(Container)`
  margin: 0.5em 0;
  padding: 0.5em;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

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

const Commit: React.FunctionComponent<{ commit: ICommit; base: string }> = ({
  commit,
  base
}) => (
  <CommitContainer>
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
      <Link to={`${base}/tree/${commit?.tree}`}>{commit?.abbrv_tree}</Link>
    </Right>
  </CommitContainer>
)

export default Commit
