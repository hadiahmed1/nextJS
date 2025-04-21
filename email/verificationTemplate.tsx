import { Html, Text, Head, Section } from "@react-email/components";

interface verificationEmailProps {
    username: string,
    otp: string
}

const VerificationEmail = ({ username, otp }: verificationEmailProps) => {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>verification email</title>
            </Head>
            <Section>
                <Text>Dear {username}, your OTP is <strong>{otp}</strong></Text>
            </Section>
        </Html>
    );
};

export default VerificationEmail;