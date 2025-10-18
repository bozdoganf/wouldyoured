#!/usr/bin/env python3
"""
Reddit Top Daily Posts Fetcher
Fetches the top daily posts from r/WouldYouRather subreddit
"""

import praw
import os
from datetime import datetime, timedelta
import json
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def setup_reddit_client():
    """
    Set up Reddit API client using environment variables or default values
    """
    # Reddit API credentials - you can set these as environment variables
    # or replace with your actual credentials
    client_id = os.getenv('REDDIT_CLIENT_ID', 'your_client_id_here')
    client_secret = os.getenv('REDDIT_CLIENT_SECRET', 'your_client_secret_here')
    user_agent = os.getenv('REDDIT_USER_AGENT', 'TopPostsFetcher/1.0 by YourUsername')
    
    try:
        print(client_id, client_secret, user_agent)
        reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )
        # Test the connection
        reddit.user.me()
        return reddit
    except Exception as e:
        print(f"Error setting up Reddit client: {e}")
        print("Please check your Reddit API credentials.")
        return None

def get_random_post_with_poll(subreddit_name, max_rank=1000, max_attempts=50):
    """
    Fetch a random post from the top posts of a subreddit that has a poll
    
    Args:
        subreddit_name (str): Name of the subreddit (without r/)
        max_rank (int): Maximum rank to choose from (e.g., 1000 for top 1000)
        max_attempts (int): Maximum number of attempts to find a post with poll
    
    Returns:
        dict: Post dictionary with poll or None if error/no poll found
    """
    reddit = setup_reddit_client()
    if not reddit:
        return None
    
    try:
        subreddit = reddit.subreddit(subreddit_name)
        
        print(f"Searching for a post with a poll from top {max_rank} posts...")
        print("This may take a few attempts...")
        
        attempts = 0
        while attempts < max_attempts:
            attempts += 1
            
            # Generate random rank between 1 and max_rank
            random_rank = random.randint(1, max_rank)
            print(f"Attempt {attempts}: Checking post at rank {random_rank}...")
            
            # Fetch posts until we reach the random rank
            for i, post in enumerate(subreddit.top(time_filter='all', limit=max_rank), 1):
                if i == random_rank:
                    # Check if post has a poll
                    if hasattr(post, 'poll_data') and post.poll_data:
                        print(f"✓ Found post with poll at rank {random_rank}!")
                        
                        poll_options = []
                        total_votes = 0
                        
                        for option in post.poll_data.options:
                            option_data = {
                                'text': option.text,
                                'vote_count': option.vote_count
                            }
                            poll_options.append(option_data)
                            total_votes += option.vote_count
                        
                        # Sort options by vote count (highest first) and take only top 2
                        sorted_options = sorted(poll_options, key=lambda x: x['vote_count'], reverse=True)
                        top_2_options = sorted_options[:2]
                        
                        # Calculate percentages for top 2 options
                        for option in top_2_options:
                            if total_votes > 0:
                                option['percentage'] = (option['vote_count'] / total_votes) * 100
                            else:
                                option['percentage'] = 0
                        
                        poll_data = {
                            'total_votes': total_votes,
                            'option_A': top_2_options[0]['text'] if len(top_2_options) > 0 else '',
                            'option_A_count': top_2_options[0]['vote_count'] if len(top_2_options) > 0 else 0,
                            'option_A_percentage': top_2_options[0]['percentage'] if len(top_2_options) > 0 else 0,
                            'option_B': top_2_options[1]['text'] if len(top_2_options) > 1 else '',
                            'option_B_count': top_2_options[1]['vote_count'] if len(top_2_options) > 1 else 0,
                            'option_B_percentage': top_2_options[1]['percentage'] if len(top_2_options) > 1 else 0,
                            'all_options': top_2_options  # Keep for display purposes
                        }
                        
                        post_data = {
                            'question': post.title,
                            'option_A': poll_data['option_A'],
                            'option_A_count': poll_data['option_A_count'],
                            'option_B': poll_data['option_B'],
                            'option_B_count': poll_data['option_B_count']
                        }
                        return post_data
                    else:
                        print(f"✗ Post at rank {random_rank} has no poll, trying again...")
            
            # If we reach here, the random rank was higher than available posts
            if random_rank > max_rank:
                print(f"Warning: Random rank {random_rank} exceeds available posts ({max_rank})")
        
        print(f"❌ Could not find a post with a poll after {max_attempts} attempts")
        return None
    
    except Exception as e:
        print(f"Error fetching posts from r/{subreddit_name}: {e}")
        return None

def display_post(post):
    """
    Display a single post in a formatted way
    """
    if not post:
        print("No post found or error occurred.")
        return
    
    print(f"\n{'='*80}")
    print(f"RANDOM POST WITH POLL FROM r/WouldYouRather")
    print(f"Fetched at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")
    
    print(f"Question: {post['question']}")
    print(f"Option A: {post['option_A']} ({post['option_A_count']} votes)")
    print(f"Option B: {post['option_B']} ({post['option_B_count']} votes)")
    
    print("-" * 80)

def save_to_json(post, filename='random_post.json'):
    """
    Save post to a JSON file
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(post, f, indent=2, ensure_ascii=False)
        print(f"\nPost saved to {filename}")
    except Exception as e:
        print(f"Error saving to JSON: {e}")

def main():
    """
    Main function to run the script
    """
    print("Reddit Random Post with Poll Fetcher")
    print("=" * 40)
    
    # Configuration
    subreddit = "WouldYouRather"
    max_rank = 250
    max_attempts = 50
    
    print(f"Searching for a random post with a poll from top {max_rank} all-time posts from r/{subreddit}...")
    print(f"Maximum attempts: {max_attempts}")
    
    # Fetch random post with poll
    post = get_random_post_with_poll(subreddit, max_rank, max_attempts)
    
    if post:
        # Display post
        display_post(post)
        
        # Save to JSON
        save_to_json(post)
        print("Successfully found post with poll")
        
    else:
        print("Failed to find a post with a poll. This could be due to:")
        print("1. Reddit API credentials issues")
        print("2. No polls found in the top 1000 posts")
        print("3. Network connectivity issues")
        print("\nTo set up Reddit API credentials:")
        print("1. Go to https://www.reddit.com/prefs/apps")
        print("2. Create a new app (script type)")
        print("3. Set environment variables:")
        print("   - REDDIT_CLIENT_ID")
        print("   - REDDIT_CLIENT_SECRET")
        print("   - REDDIT_USER_AGENT")

if __name__ == "__main__":
    main()
