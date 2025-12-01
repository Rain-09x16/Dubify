import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A73E8] mb-2">Join Dubify</h1>
          <p className="text-[#6B7280]">Create your account to start exploring Dubai with AI</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />
      </div>
    </div>
  );
}
