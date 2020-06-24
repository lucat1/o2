import * as React from 'react'
import { Head, navigate, usePage } from '@quercia/quercia'
import { Flex, Box } from 'rebass'

import Text from '../../components/text'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Layout from '../../components/repository/layout'
import Comment from '../../components/issue/comment'
import Write from '../../components/issue/write'

import { Base, Issue, Comment as IComment } from '../../types/repository'
import elapsed from '../../types/time'

export interface IssuesProps {
  issue: Issue
  comments: IComment[]
}

export default ({ repository, owns, issue, comments }: Base<IssuesProps>) => {
  // used to disable the comment button if the user is not logged in
  const { account } = usePage()[1]

  const [isLoading, setLoading] = React.useState(false)
  const input = React.useRef<HTMLTextAreaElement>()
  const comment = () => {
    const { value } = input.current
    if (!value) return

    setLoading(true)
    const body = new FormData()
    body.set('body', value)

    navigate(window.location.pathname, 'POST', {
      body,
      credentials: 'same-origin'
    })
  }

  // when the comments object changes it means we either changed
  // issue or have posted a comment, so we should clear the input field
  React.useEffect(() => {
    setLoading(false)
    input.current.value = ''
  }, [comments])

  return (
    <Layout owns={owns} repository={repository} page='Issues'>
      <Head>
        <title>
          {typeof repository === 'object'
            ? `${repository.owner}/${repository.name}`
            : ''}
          {' issue'}- o2
        </title>
        <meta
          name='description'
          content='an issue on git repository on the o2 service'
        />
      </Head>

      <Flex flexDirection='column' py={2}>
        <Flex flex={1} justifyContent='space-between'>
          <Text height={4} width={9} fontSize='1.25em'>
            {issue?.title}
          </Text>
          <Text width={5} color='primary.default'>
            #{issue?.id}
          </Text>
        </Flex>
        <Flex flex={1}>
          <Text color='bg.3' py={2} fontSize='xs'>
            opened {elapsed(issue?.opened)}
          </Text>
        </Flex>
      </Flex>
      <Divider />

      {(comments || []).map((comment, i) => (
        <Comment name={comment.name} picture={comment.picture} key={i}>
          <Box css={{ userSelect: 'none' }} py={1} px={4}>
            <Text color='bg.3' fontSize='xs'>
              commented {elapsed(comment.commented)}:
            </Text>
          </Box>
          <Divider />

          <Text fontSize='xs' py={2} px={4}>
            {comment.body}
          </Text>
        </Comment>
      ))}

      <Write ref={input} />
      <Flex justifyContent='flex-end'>
        <Button disabled={!account || isLoading} onClick={comment} maxWidth={5}>
          Comment
        </Button>
      </Flex>
    </Layout>
  )
}
