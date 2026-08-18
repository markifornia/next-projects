"use client";

import { useState } from "react";

import { upvotePost } from "@/actions/actions";
import Icon from "./icon";

type UpvoteBtnProps = {
    postId: number;
    votes: number
}

export default function UpvoteBtn({ postId, votes}: UpvoteBtnProps) {

    return (
        <button
        type="button"
        onClick={() => { upvotePost(postId)}}
        className="h-9 shrink-0 rounded-md border border-zinc-300 bg-zinc-100 px-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-200"
        >
        Upvote {votes}
        <Icon />
        </button>
    )
}