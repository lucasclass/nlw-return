import { FormEvent, useState } from "react";
import { ArrowLeft, Camera } from "phosphor-react";
import { feedbackTypes, FeedbackType } from "..";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";
import { api } from "../../../lib/api";
import { Loading } from "../../Loading";

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequest: () => void;
    onFeedbakSent: () => void;
}
export function FeedbackContentStep({ feedbackType, onFeedbackRestartRequest, onFeedbakSent }: FeedbackContentStepProps) {
    const feedbackTypeInfo = feedbackTypes[feedbackType]
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [commentFeedback, setCommentFeedback] = useState<string>('')
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)

    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault()
        
        setIsSendingFeedback(true)
        try {
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: screenshot,
                comment: commentFeedback
            })
        } catch (error) {
            console.log(error)
            setIsSendingFeedback(false)
        }
        setIsSendingFeedback(false)
        onFeedbakSent()
    }

    return (
        <>
            <header>
                <button
                    type='button'
                    className='top-5 left-5 absolute text-secondary-light hover:text-primary-light dark:text-secondary-dark dark:hover:text-primary-dark'
                    onClick={onFeedbackRestartRequest}
                >
                    <ArrowLeft weight='bold' className='w-4 h-4' />
                </button>

                <span className="text-xl leading-6 flex items-center gap-2">
                    <img
                        src={feedbackTypeInfo.image.source}
                        alt={feedbackTypeInfo.image.alt}
                        className='w-6 h-6' />
                    {feedbackTypeInfo.title}
                </span>

                <CloseButton />
            </header>

            <form
                className='my-4 w-full'
                onSubmit={handleSubmitFeedback}
            >
                <textarea
                    className='min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-primary-light dark:text-primary-dark border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 resize-none scrollbar hover:scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin'
                    placeholder='Conte com detalhes o que está acontecendo...'
                    onChange={event => setCommentFeedback(event.target.value)}
                />
                <footer className='flex gap-2 mt-2'>
                    <ScreenshotButton
                        onScreenshotTook={setScreenshot}
                        screenshot={screenshot}

                    />

                    <button
                        type='submit'
                        disabled={commentFeedback.length === 0 || isSendingFeedback}
                        className='p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500 disabled:text-white dark:disabled:text-stroke-light'
                    >
                        {isSendingFeedback ? <Loading/> : 'Enviar Feedback' }
                    </button>
                </footer>
            </form>

        </>
    );
}