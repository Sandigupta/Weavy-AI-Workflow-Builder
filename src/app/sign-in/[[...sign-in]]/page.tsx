import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-[#1c1c1e] border border-white/10",
                    }
                }}
            />
        </div>
    );
}
