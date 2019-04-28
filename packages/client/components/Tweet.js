import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import colors from '../lib/colors';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';

export const TweetFooter = ({
  replyCount,
  retweetCount,
  likeCount,
  retweeted,
  liked,
  onReply,
  onRetweet,
  onLike,
}) => (
  <div className="tweet-footer">
    <div className={cx('reply')} onClick={onReply}>
      <Icon name="reply" />
      <span>{replyCount || ''}</span>
    </div>
    <div className={cx('retweet', { active: retweeted })} onClick={onRetweet}>
      <Icon name="retweet" />
      <span>{retweetCount || ''}</span>
    </div>
    <div className={cx('like', { active: liked })} onClick={onLike}>
      <Icon name={liked ? 'heartBadge' : 'heart'} />
      <span>{likeCount || ''}</span>
    </div>

    <style jsx>{`
      .tweet-footer {
        display: flex;
        color: rgba(55, 55, 55, 0.8);
      }

      .tweet-footer > div {
        padding-right: 4px;
        display: flex;
        align-items: center;
        min-width: 80px;
        cursor: pointer;
      }

      .tweet-footer span {
        margin-left: 8px;
        font-size: 0.8em;
        font-weight: bold;
      }

      .tweet-footer :global(i) {
        font-size: 1.1em;
        color: rgba(55, 55, 55, 0.8);
      }

      .tweet-footer span,
      .tweet-footer :global(i) {
        transition: color 0.2s ease;
      }

      .tweet-footer > div.reply:hover,
      .tweet-footer > div.reply:hover :global(i) {
        color: ${colors.twitterBlue};
      }

      .tweet-footer > div.retweet.active,
      .tweet-footer > div.retweet:hover,
      .tweet-footer > div.retweet.active :global(i),
      .tweet-footer > div.retweet:hover :global(i) {
        color: ${colors.retweet};
      }

      .tweet-footer > div.like.active,
      .tweet-footer > div.like:hover,
      .tweet-footer > div.like.active :global(i),
      .tweet-footer > div.like:hover :global(i) {
        color: ${colors.like};
      }
    `}</style>
  </div>
);

const RETWEET_QUERY = gql`
  mutation RetweetQuery($input: RetweetInput!) {
    retweet(input: $input) {
      context {
        originalTweet {
          id
          content
          retweeted
        }
        contextTweet {
          id
        }
      }
    }
  }
`;

const LIKE_QUERY = gql`
  mutation LikeQuery($input: LikeInput!) {
    like(input: $input) {
      context {
        originalTweet {
          id
          content
          liked
        }
      }
    }
  }
`;

const CONTEXT_ACTION_ICONS = {
  RETWEET: 'retweeted',
  LIKE: 'heartBadge',
};

const CONTEXT_ACTION_TEXT = {
  RETWEET: 'Retweeted',
  LIKE: 'liked',
};

const Tweet = ({ tweet, refetch, context, onClick, noBorders, replyingTo }) => {
  const variables = { input: { tweetId: tweet.id } };
  const retweet = useMutation(RETWEET_QUERY, { variables });
  const like = useMutation(LIKE_QUERY, { variables });

  const handleRetweet = async () => {
    const r = await retweet();
    console.log(' r', r);
    // refetch && refetch();
    // TODO: add message of success
  };

  const handleLike = async () => {
    await like();
    refetch && refetch();
    // TODO: add message of success
  };

  const { id, content, retweetCount, likeCount, retweeted, liked } = tweet;
  const { username, name } = tweet.user;

  return (
    <div
      className={cx('tweet', { 'no-borders': noBorders })}
      onClick={() => onClick(id)}
    >
      {context && (
        <div className="context">
          <Icon name={CONTEXT_ACTION_ICONS[context.action]} size="14px" />
          <span>
            {context.user.name} {CONTEXT_ACTION_TEXT[context.action]}
          </span>
        </div>
      )}

      <div className="tweet-content">
        <div className="left">
          <Avatar size="medium" />
        </div>

        <div className="body">
          <div className="meta">
            <Link
              href={`/profile?username=${username}`}
              as={`/profile/${username}`}
              prefetch
            >
              <a>
                <span className="name">{name}</span>
                <span className="username">@{username}</span>
              </a>
            </Link>
          </div>
          {replyingTo && (
            <div className="replying-to">
              Replying to <a>@{replyingTo}</a>
            </div>
          )}
          <div className="text-content">{content}</div>
          <TweetFooter
            retweetCount={retweetCount}
            likeCount={likeCount}
            retweeted={retweeted}
            liked={liked}
            onRetweet={handleRetweet}
            onLike={handleLike}
          />
        </div>
      </div>
      <style jsx>{`
        .tweet {
          padding: 9px 12px;
          cursor: pointer;
          background-color: #fff;
          border-left: 1px solid ${colors.boxBorder};
          border-right: 1px solid ${colors.boxBorder};
          border-bottom: 1px solid ${colors.boxBorder};
        }

        .tweet.no-borders {
          border: 0;
        }

        .tweet:hover {
          background-color: ${colors.gray};
        }

        .context {
          padding: 0 0 9px 56px;
          display: flex;
          align-items: center;
          font-size: 0.8em;
          line-height: 0.8em;
          color: ${colors.blueGray};
        }

        .context :global(i) {
          margin-left: -24px;
          margin-right: 6px;
          color: ${colors.blueGray};
        }

        .replying-to {
          margin: 4px 0;
          font-size: 0.87em;
          color: ${colors.blueGray};
        }

        .tweet-content {
          display: flex;
        }

        .body {
          padding-left: 8px;
        }

        .meta {
          line-height: 1em;
        }

        .meta a:hover .name {
          text-decoration: underline;
          color: ${colors.twitterBlue};
        }

        .name {
          font-weight: bold;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.85);
        }

        .username {
          margin-left: 5px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.9em;
        }

        .text-content {
          margin: 2px 0 8px;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </div>
  );
};

Tweet.fragments = {
  tweet: gql`
    fragment TweetFields on Tweet {
      id
      content
      replyCount
      retweetCount
      likeCount
      retweeted
      liked
      user {
        id
        name
        username
      }
    }
  `,
};

export default Tweet;
