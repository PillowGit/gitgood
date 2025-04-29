"use client";

import TestCasesForm from "./TestCasesForm";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function ProblemDescription({ questionData, tags, difficulty, language, dates, onVote, userVote, votingInProgress, session }) {
  const votesGood = questionData?.metadata?.votes_good || 0;
  const votesBad = questionData?.metadata?.votes_bad || 0;

  return (
    <>
      <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8 overflow-y-auto border-r-0 md:border-r border-gray-700">

        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-white">
          {questionData?.metadata?.title}
        </h1>

        {/* Difficulty & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={
            difficulty === "Easy" ? "px-3 py-1 rounded-full text-sm font-medium text-white bg-green-600" :
            difficulty === "Medium" ? "px-3 py-1 rounded-full text-sm font-medium text-white bg-yellow-600" :
            difficulty === "Hard" ? "px-3 py-1 rounded-full text-sm font-medium text-white bg-red-600" :
            "px-3 py-1 rounded-full text-sm font-medium text-white bg-slate-600"
          }>
            {difficulty}
          </span>
          {
            tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm bg-gray-600 text-gray-200">
                {tag}
              </span>
            ))
          }
        </div>

        {/* Voting Section */}
        <div className="flex items-center mb-4 p-3 bg-[#2a2a2a] rounded-lg border border-gray-700">
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-300">Community Rating:</p>
            <div className="flex items-center mt-1">
              <span className="text-[#1da568] font-medium">+{votesGood}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-[#ce5545] font-medium">-{votesBad}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onVote && onVote(userVote === "up" ? "none" : "up")}
              disabled={votingInProgress || !session}
              title={!session
                ? "Sign in to vote"
                : userVote === "up"
                  ? "Remove your upvote"
                  : userVote === "down"
                    ? "Change to upvote"
                    : "Upvote this problem"
              }
              className={`p-2 rounded-full transition ${userVote === "up"
                ? "bg-[#1f392a] text-[#1da568]"
                : votingInProgress || !session
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-gray-300 hover:bg-[#1f392a] hover:text-[#1da568]"
                }`}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => onVote && onVote(userVote === "down" ? "none" : "down")}
              disabled={votingInProgress || !session}
              title={!session
                ? "Sign in to vote"
                : userVote === "down"
                  ? "Remove your downvote"
                  : userVote === "up"
                    ? "Change to downvote"
                    : "Downvote this problem"
              }
              className={`p-2 rounded-full transition ${userVote === "down"
                ? "bg-[#392a2a] text-[#ce5545]"
                : votingInProgress || !session
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-gray-300 hover:bg-[#392a2a] hover:text-[#ce5545]"
                }`}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Author, Dates, Language */}
        <div className="mb-6 text-sm text-gray-400 space-y-1">
          <p>Author: {questionData.metadata?.author_name}</p>
          <p>Created: {dates.created}</p>
          <p>Last Updated: {dates.updated}</p>
          <p>Language: {language}</p>
        </div>

        {/* Description */}
        <div className="prose prose-invert mb-6 max-w-none">
          <h2 className="text-xl font-semibold mb-2 text-gray-100 border-b border-gray-600 pb-1">Description:</h2>
          <ReactMarkdown>
            {questionData?.description}
          </ReactMarkdown>
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold my-6 text-white">Test Cases:</h2>
        {TestCasesForm.length > 0 ?
          questionData?.test_cases.map((testCase, index) => (
            <div key={index} className="bg-[#2d2d2d] p-4 rounded-lg border border-gray-700">
              <p className="font-semibold mb-2 text-gray-100">Example {index + 1}:</p>
              <pre className="text-sm text-gray-300 bg-[#222222] p-2 rounded overflow-x-auto">
                <strong className="text-gray-100">Input:</strong> {Object.entries(testCase.inputs).map(([key, value]) => `${key}: ${value}`).join(', ')}
              </pre>
              <pre className="text-sm text-gray-300 bg-[#222222] p-2 rounded overflow-x-auto">
                <strong className="text-gray-100">Output:</strong> {testCase.ANSWER}
              </pre>
            </div>
          ))
          : <p className="text-gray-400">There are no viewable test cases for this question.</p>
        }
        </div>

      </div>
    </>
  );
}
