---
title: "Setting Up a Password Manager"
description: "A practical guide to setting up and using 1Password as your password manager."
publishDate: "2021-02-20"
updatedDate: "2026-03-03"
tags: ["cyber-security", "password-manager"]
---

## What is a password manager?

A place to manage all your passwords.

## Why use a password manager?

[See this post](/posts/why-do-i-need-a-password-manager)

## How to use a password manager

First of all, I think it is easiest to set up a password manager using a laptop.

First things first — while 2FA is optional for a new 1Password account, I strongly recommend having something you can use for 2FA ready so you can turn it on right after signup.

You might already have something you use for 2FA with other accounts — often time-based one-time passwords. Usually a 6-digit code that changes every 30 seconds.
In which case, just use that for now. Many people have Microsoft Authenticator <https://www.microsoft.com/en-gb/security/mobile-authenticator-app> already for use with an old Hotmail or Microsoft account. Or Google Authenticator <https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid&oco=0>.

If you don't have anything, I would recommend using Authy <https://authy.com/>.
You can back up if you like, so if you switch phones you can transfer it easily.

The second thing you will need is a master password. This is important as it will be used to secure everything.
It must not be something you have used before or even similar to anything you have used before. Picking a passphrase of 4 or 5 random words with spaces in between is my suggestion. 4 long words, or 5 shorter ones seem to be the right balance between enough security without making it hard to remember or type. I would not worry about capitalising the letters or adding numbers or symbols.
Write it down on a piece of paper and put it in your purse/wallet to start with. If you forget this you will be locked out. Once you are happy you have remembered it, you can destroy the paper. Yes you have been told not to write passwords down, but forgetting it will mean you have no access. The chance of someone finding it written down will be slim — it is only whilst you memorise it.

For some ideas this site helps: <https://www.useapassphrase.com/> as does the 1Password generator <https://1password.com/password-generator/>.
Rather than pick one generated for you, you should come up with one yourself.

Check out the pricing for your region by selecting it here <https://support.1password.com/regions/#choose-your-region>.
There is an option for just you. But the families option works well (up to 5 people). A few advantages: better value, sharing between individuals is easy, and you can set it up so that you can recover another account if they forget their master password.

There is a 14-day free trial and you can move from an individual account to a family account.

You will need to enter your card details when you sign up, as after the free trial you will be charged if you do not cancel and close your account.

Once you have registered you will download a PDF Emergency Kit. This contains your secret key. This is something 1Password generated and without it you can't log in to 1Password on a new device. You can print it out and put it in a safe place (like a safe, with your passport and birth certificate etc). Keep the PDF safe as well. If you were to lose access to all devices currently signed into 1Password, signing in would be impossible without your secret key.

Go to your name on the top right, select your profile, then on the left under more actions pick Manage Two Factor Authentication. Add your 2FA.

Don't stop now though, add all your devices and browser extensions.
Head to your name on the top right again and pick get apps.
You can check out the options here too <https://1password.com/downloads/>.

I would start with your desktop client called 1Password 8. Once installed, sign into it — the easiest way is to go to your profile and get apps and click the add your account directly to fill the details in, then enter your master password.
I would set it to lock and ask you to enter your master password quite often at first — like every 5 minutes. Once you have typed it plenty of times you can start to move this out to every hour, then every day, so it is less annoying but you still remember it.
You will find on most modern devices it can use biometrics to unlock — set it to require your master password once a week to help make sure you don't forget it.

The benefit of a password manager comes with it integrating with your browser. If you are on a Mac and using Safari you can switch it on, otherwise there are extensions for Chrome, Firefox, Edge and Brave. Install the extension and sign in. <https://support.1password.com/getting-started-browser/>

This is a good start, but keep going and set up the app on your phone, tablet and any other devices. You need your secret key for those — you can set up biometrics on your phone for instance. If your phone restarts you may have to enter your master password again. Otherwise you could go a week without entering your master password.

On your desktop/laptop sign into sites and as you do save them into 1Password. Once a site is saved, you can always sign back out from it and try logging in with 1Password to check it has saved correctly and works. This will get you comfortable with using 1Password as well as saving all your sites.
Don't worry about changing any of them just yet.

If you are on the family plan, you can store some of your passwords in a shared vault with one or more of your family. Passwords for streaming sites and food delivery are common ones to share, as are Wi-Fi passwords.

Try to go through and save as many sites as you can remember having an account on. Check your favourites, history, and emails to help jog your memory. I'm sure I read somewhere the average is around 200 sites. I have around 400 which I have accumulated over many years. Although I probably only sign into 100 a year.

As you add each site, consider whether you actually need that account. If you don't, look to delete it — fewer accounts means a smaller surface for data breaches and spam. Most sites have a delete account option buried in the account or privacy settings. If you can't find one, check the privacy policy for a contact address and request deletion that way. Keep the entry in 1Password until you have confirmed the account has been deleted — that way you still have the credentials if you need them during the process.

Once you have saved as many as you can remember, try to change a few passwords. Start with ones you are less concerned about and if you get into a muddle you wouldn't worry about. Maybe that online shop you just bought that one thing from.

After changing a few passwords on sites you are less worried about, take a break if you like, leave it a day or so. Just enjoy the ease of 1Password filling in your details (including apps and sites on your phone/tablet). And keep practising your master password.

You can also save other useful information into 1Password like your National Insurance number, Passport and Driving license details. Saving your credit card details into 1Password helps you autofill them and I think it is better than saving them on lots of random online shop sites where they could either be leaked or misused.

You can also store important documents (up to 1GB), so a scan of your birth certificate, passport etc is a good idea.

You can mark items as favourites and add tags and locations to help find the records you want quicker and easier.

Hopefully you are enjoying not typing passwords (apart from your master password, which you can now easily remember). And having easy access to lots of your important information, completing your passport details when booking flights and credit card details when ordering.

But whilst this is all good, the reason for using a password manager is so you could have unique strong passwords for each site. So far you might have changed a few passwords to try it out.

Now is the time to start to change a few more.
I would avoid changing your email provider(s) or other accounts you could not do without for now. Your email accounts are the most important ones as usually these allow you to reset any other sites' passwords. Until you are more comfortable with using 1Password and have remembered your master password at least.

One way to help you pick which ones is to look at Watchtower.
This will help to pick the sites that need the passwords changed the most.
<https://support.1password.com/watchtower/>

Compromised sites — unlikely to have any yet as these will only appear where a site has had a data breach and you have not changed your password since. As you have only just created these entries there won't be any yet. If you do ever see these then change these right away.

Vulnerable passwords — check this Watchtower section now and again; any passwords listed here need changing as they are already on a list of ones people will try to use against your accounts.

Weak passwords — change any weak passwords to make them more secure.

Reused passwords — this is the main reason for starting this journey. Even a strong complex password could be stored in plain text and leaked by a site, so changing these is key and making sure you do not reuse them. However, this will only spot ones that are exactly the same. So if you used password123!Facebook and password123!Twitter it won't spot this. But an attacker will.

Unsecured sites — this lists any sites saved in 1Password with http instead of https. Review them and if they support https upgrade the details in 1Password. If they don't then your passwords will be sent to those sites in the clear and are not safe. Whilst you are there, update the passwords for these sites if you have not already since saving in 1Password. You can see created and last modified dates.

Passkeys — lists sites that support passkeys but you don't have one saved. Set up passkeys wherever possible as they are the strongest way to authenticate, as they cannot be used by phishing sites. See the [Two-Factor Authentication](#two-factor-authentication-2fa) section below for a full breakdown of your options.

Two-Factor Authentication — lists sites that support 2FA but do not have a one-time passcode saved. For each one, set up 2FA and consider storing the TOTP code in 1Password. See the [Two-Factor Authentication](#two-factor-authentication-2fa) section below for a full breakdown of your options.

After that, you could update passwords as you visit sites if they have not already been updated since being created in 1Password. Then to cover all of them go through them alphabetically until they all have new secure passwords.

After updating all of them you should by now be very comfortable with 1Password and remember your master password. Now is the time to update the remaining sites like your email.

There are some short videos to help show you how to sign up and get started: <https://www.youtube.com/playlist?list=PLeXQRfNcE6-AYi81Q60EBDZJIx1SiPKhM>

## Two-Factor Authentication (2FA)

Passwords are the first factor — something you know. Two-factor authentication (2FA) adds a second factor so that even if your password is stolen or guessed, an attacker still cannot get in. Here is a breakdown of the options, from weakest to strongest. <https://2fa.directory/gb/> lists what type, if any, 2FA a site supports.

### SMS / text message codes

If a site only offers SMS as a second factor, turn it on. It is far better than nothing. A code texted to your phone stops the vast majority of automated credential-stuffing attacks.

Its weakness is SIM-swapping — where an attacker convinces your mobile carrier to transfer your number to a SIM they control. This is rare and targeted, so for most people the risk is low. Do not let the imperfection of SMS put you off enabling it. Use it until a better option is available, then upgrade.

### Time-based one-time passcodes (TOTP)

These are the 6-digit codes that change every 30 seconds — the kind generated by Microsoft Authenticator, Google Authenticator, or Authy. They are significantly stronger than SMS because the code is generated locally on your device and never travels over a phone network. The downside to these is that a phishing site could convince you to enter the code on their website, allowing a criminal to log into your account. Here is a good example of this happening: <https://www.troyhunt.com/a-sneaky-phish-just-grabbed-my-mailchimp-mailing-list/>. Side note: 1Password only wants to fill in your password on the website saved in the entry, so pay attention if that isn't working. Whilst often the website has a different name for their login, it could also be a phishing site.

**Storing TOTP codes in 1Password**

When a site offers to set up an authenticator app it will usually show you a QR code. You can scan this directly in 1Password rather than a separate app:

1. Open the login entry in 1Password for that site.
2. Edit the item and add a new field of type *One-Time Password*.
3. Click the QR code icon and scan (or paste the secret key shown beneath the QR code).
4. Save. 1Password will now generate the rotating code and autofill it alongside your username and password.

This is convenient — one app to open instead of two. The trade-off is that your password and your second factor are in the same place. If someone compromises your 1Password account they have both. Mitigate this by keeping your 1Password master password strong and unique, enabling 2FA on your 1Password account itself (using a separate app like Authy for that specific code), and storing your Emergency Kit securely offline.

If you prefer to keep TOTP codes separate for higher-risk accounts (email, banking), store those in Authy or another dedicated authenticator app and keep everything else in 1Password for convenience.

### Passkeys

Passkeys are a newer standard that can replace both the password and the second factor in one step. However, they are often only used as a second factor of authentication. They use public-key cryptography: a private key stays on your device (or in your password manager), and a public key is registered with the website. When you sign in, your device proves it holds the private key without ever sending it anywhere.

**Why passkeys are stronger**

- Nothing is typed, so phishing pages cannot steal a passkey — the key is bound to the exact site it was created for.
- No shared secret is sent to the server, so a database breach cannot expose it.
- Passkeys resist SIM-swapping and TOTP interception attacks.

**Using passkeys in 1Password**

When a site offers to create a passkey:

1. Trigger the passkey creation flow on the site (usually under *Security* settings).
2. Your browser will prompt you to save the passkey — choose 1Password as the provider.
3. 1Password saves the passkey linked to that login entry.
4. Next time you sign in, 1Password detects the passkey prompt and fills it automatically.

Passkey support is rolling out quickly. Check [the community passkey directory](https://passkeys.directory) to see which sites support them. Where available, prefer a passkey over a password + TOTP combination.

### Physical security keys (YubiKey)

For the highest-security accounts (email, 1Password itself, financial accounts), a hardware key like a YubiKey is the gold standard. You plug it in or tap it (NFC) and it cryptographically proves your identity. It cannot be phished remotely. Worth the investment if you want the strongest possible protection. Buy at least two and place one in a safe and the other on your keyring.
