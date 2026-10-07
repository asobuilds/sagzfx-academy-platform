"use client";
import {useEffect,useState} from "react";
import {endpoints} from "@/lib/api";
export default function CommunityVoice(){
 const [reviews,setReviews]=useState<Array<{review_id:string;full_name:string;rating:number;body:string}>>([]),[body,setBody]=useState(""),[feedback,setFeedback]=useState(""),[rating,setRating]=useState(5),[notice,setNotice]=useState("");
 useEffect(()=>{void endpoints.publicReviews().then(setReviews).catch(()=>setReviews([]));},[]);
 async function review(){setNotice("");try{await endpoints.submitReview(rating,body);setBody("");setNotice("Review submitted for approval.");}catch{setNotice("Sign in to submit a review.");}}
 async function sendFeedback(){setNotice("");try{await endpoints.submitFeedback(feedback);setFeedback("");setNotice("Thank you. Your feedback was received privately.");}catch{setNotice("Sign in to send feedback.");}}
 return <div className="space-y-12">
  <div><h2 className="text-3xl md:text-4xl font-bold text-white">What learners say</h2><p className="text-slate-400 mt-2">Only approved reviews from registered users appear here.</p>
   <div className="grid md:grid-cols-3 gap-4 mt-6">{reviews.length?reviews.map(r=><article key={r.review_id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5"><div className="text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div><p className="text-slate-200 my-3">“{r.body}”</p><div className="text-sm text-slate-400">{r.full_name}</div></article>):<div className="md:col-span-3 rounded-2xl border border-dashed border-slate-700 p-6 text-slate-400">No approved reviews yet. Registered learners can submit the first review below.</div>}</div>
  </div>
  <div className="grid md:grid-cols-2 gap-6">
   <form onSubmit={e=>{e.preventDefault();void review();}} className="rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"><h3 className="text-xl font-bold text-white">Leave a review</h3><select value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3 text-white">{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} star{n>1?"s":""}</option>)}</select><textarea required minLength={10} maxLength={1200} value={body} onChange={e=>setBody(e.target.value)} placeholder="Share your learning experience" className="w-full min-h-28 rounded-lg bg-slate-950 border border-slate-700 p-3 text-white"/><button className="brand-gradient px-5 py-3 rounded-xl font-semibold text-white">Submit review</button></form>
   <form onSubmit={e=>{e.preventDefault();void sendFeedback();}} className="rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"><h3 className="text-xl font-bold text-white">Private feedback</h3><p className="text-sm text-slate-400">Tell the academy what should improve. Feedback is not published as a review.</p><textarea required minLength={5} maxLength={2000} value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Your feedback" className="w-full min-h-28 rounded-lg bg-slate-950 border border-slate-700 p-3 text-white"/><button className="border border-cyan-500 text-cyan-300 px-5 py-3 rounded-xl font-semibold">Send feedback</button></form>
  </div>{notice&&<p className="text-cyan-300">{notice}</p>}
 </div>;
}