---
title: "World Password Day 2022"
description: "Celebrating World Password Day with tips on password hygiene and security."
publishDate: "2022-05-08"
tags: ["cyber-security", "password", "password-manager"]
---

As it was [World Password Day](https://nationaltoday.com/world-password-day/) on Thursday I thought I would write this post to help promote some good password hygiene.

## History of passwords

Since the Roman's, people have used passwords to authenticate people. Back then it was to establish friend from foe.

The first use of a password in computing was from the early 1960's at MIT. The computer was a shared resource with users allocated 4 hours a week. A password was used to authenticate the users and also allowed them keep their own files private.

I remember a time in the early days of the world wide web (1990s) when you just used the same simple password everywhere. I don't remember having that many sites or places to enter a password either. More info at [Wikipidea](https://en.wikipedia.org/wiki/Password#History).

## Passwords now

Acording to some research a few years ago the average person had around 100 passwords (or at least places that needed passwords).I have over 300. Most sites in the early days probably didn't have much if any password requirements, now most sites do have stricter requirements. Some even check against lists of known passwords.

## Why should we care about passwords?

Many people think they have nothing to loose, and nobody would be interested in 'hacking' them. But how many of us have seen family or friends saying they have had their social media or email accounts compromised?

Criminals try and compromise emails and social media accounts of anyone they can. They can then use these to compromise others or try and get money from family and friends whilst they impersonate you.

![Hacker in a hoodie with an annonymous mask using a laptop](/images/hacker.jpeg)

## How could someone break into my account?

Some of the most common methods to compromise your account:

1. Credential reuse - An attacker obtains a list of usernames and passwords from a site you have an account on. They take your credentials and try them on other sites. Perhaps even with some variation.
2. Credential stuffing - An attacker takes a list of commonly used passwords and tries to log into your account by trying each of them. This is a type of brute force attack, an attacker could try every possible combination, but in practice using known bad passwords first is more efficent.
3. Phishing - An attaker tricks you into clicking a link that takes you to a fake site. Often pretending to be a major social media site or email provider. It then asks you to login and captures your credentials. This can be automated to take your credentials and login using them to the real site. If that site uses 2FA (like a code sent to you via SMS), the hackers automation can even ask for the any 2FA codes.

## How can I avoid getting hacked?

As one of the most common ways of account copmrimse is due to password reuse. Use a unique password for each site. Nobody is going to remember 100+ different passwords. And coming up with some way of doing it like tagging on the name of the site to the end of the password would make it easy to spot a pattern like that. Which leaves writting your password down. Something we have been told never to do. But that was back when the danger of someone halfway round the world was lower than some vistor to your office (or co-worker) seeing the postit note on your monitor with the one password you use everywhere written on it.

To understand the scale of breaches there is a great visulisation. [World's Biggest Data Breaches & Hacks, selected events over 30,000 records](https://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/).

If you want to see how you might have been impcated then check out [have i been pwned](https://haveibeenpwned.com/).

## Password managers

A password manager allows you to store a different password for every site, so if one is compromised the rest aren't. As you dont need to remember the paswords they can be as long and complex as you like, making them hard to crack or guess. Another benefit of using a password manager is that if someone tricks you into visiting a fake login page, your password manager won't autofill your credentials. So in short it will defend you aginst the most common ways of having your account comprimisd.

It is also quicker and easier to login to sites and apps with a password manager.

But now we are storing all our passwords in one place, what if the password manager is compromised? Yes that would be a problem, but if we use the same password on each of the 100 sites and one site is compromised then all of them are. And that situation is more likely. Now you only need to remember one password for your password manager, and so you can make it much harder to guess or crack, and it won't be used anywhere else. Also, unlike most of those 100 sites, the password managers allow two-factor authentication and are focused on protecting themselves.

## Strong passwords

When you register on a site and set a password, generally that password is not just stored exactly as you entered it. Otherwise, anyone with access to the list could know everyone's passwords and use them. Given when you login, the site needs to compare what you entered with the password it already has on file, that would mean the site has access to the list.

Instead a site whould create a hash of your password, which is a one way mathametical function which can not be reveresed. So to see if you the password provided matches the one stored, the password provided is hashed and compared against the stored hash. So if the list of users passwords on a site is stolen, the criminal has hashes rather than passwords. To work out the passwords they must 'crack' them by generating hashes to compare against the stolen ones until they get a match. Rather than taking time to generate hashes from scratch, they will have a large list of already generated hashes called 'rainbow tables'. These lists of hashes can be very large in size, GB or event TB, and generating hashes can take a lot of time.

I am over simplifying this, but in short, using a well known password or a simple one will be easier for it to be revealed. So whilst 1q2w3e4r5t6y is 12 characters long, has a mix of letters and numbers, it is on the list of well known previously used passwords and so would be trivial to identify. For more info [Troy Hunt has a good blog post.](https://www.troyhunt.com/we-didnt-encrypt-your-password-we-hashed-it-heres-what-that-means/)

Also, using a password that is easily cracked or used by others will mean it is on a list of known passwords and could be used by attackers trying to login as you.

[Pwned Passwords](https://haveibeenpwned.com/Passwords) lets you see if your password is already known.

As demonstrated well in [this cartoon](https://xkcd.com/936 "XKCD comic password strength"), the password Tr0ub4dor&3 is easier for a computer to guess, than "correct horse battery staple". Also, a passphrase is easier to remember.

![Password Strength cartoon](https://imgs.xkcd.com/comics/password_strength.png "Password Strength")

So for passwords stored in your password manager, make them as long as the site will allow and yes include as many upper and lower case letters as well as numbers and symbols.

For passwords you need to remember, like your password manager use a passphrase. The [EFF](https://www.eff.org/dice "EFF dice") has a wordlist and walks you through how you can use it and dice to generate a passphrase. Or easier still [https://www.useapassphrase.com/](https://www.useapassphrase.com/) helps to generate a passphrase.

## Two-factor Authentication

Whilst your password is your first line of defence. If there is an option of using a second factor, then do so. Any second factor will severly reduce the chance of your account being compromised. Whilst SMS is the least favourite option, it is still better than no second factor. Most comonly used is a 6 digit numeric code rotated every 30 second. For this you can use Google or Microsoft authenticator app, or better still [Authy](https://authy.com/). To be even more secure, use a physical security key like a [YubiKey](https://www.yubico.com/), they can't be phished and are easy to use. Just keep one on your key chain and a backup in a safe place.

A great resource for what sites do or don't support 2FA is [2FA Directory](https://2fa.directory/gb/)

## What does the future hold for passwords?

[Well Microsoft, Apple, Google are trying to eliminate passwords by throwing their support behind standards developed by the FIDO Alliance and the World Wide Web Consortium (W3C).](https://www.theregister.com/2022/05/05/microsoft-apple-google-fido/)

[You can already go passwordless with Microsoft.](https://support.microsoft.com/en-us/account-billing/how-to-go-passwordless-with-your-microsoft-account-674ce301-3574-4387-a93d-916751764c43)

## What should I do now?

If you don't have a password manager yet and want to start using one, take a look at my post [Password Managers](/posts/setting-up-a-password-manager). If you aren't convinced yet, see [Why do I need a password manager?](/posts/why-do-i-need-a-password-manager).

Turn on 2FA on your email and social media accounts and as many other sites as you can.

Many sites like Facebook and Google have security and privacy checkups that walk you through changing your setting to make them more secure and private. Why they don't have these as the default settings I don't know.

Brian Krebs pointed out maybe World Password day should be World Turn on 2FA Day. I would agree if people were using strong unique passwords already, but I know they aren't.

<blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p lang="en" dir="ltr">&quot;World Password Day&quot; (May 5) should be renamed &quot;World Turn on 2FA Day.&quot; That way, observance of it might actually make a dent in account takeovers. When was the last time you checked your 2FA options for the various accounts/sites you care about? <a href="https://t.co/Yk6eCBVgNA">https://t.co/Yk6eCBVgNA</a> FTW <a href="https://t.co/ZlVUYBveDQ">pic.twitter.com/ZlVUYBveDQ</a></p>&mdash; briankrebs (@briankrebs) <a href="https://twitter.com/briankrebs/status/1521971026963353613?ref_src=twsrc%5Etfw">May 4, 2022</a></blockquote>
