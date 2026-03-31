---
title: "World Backup Day: Do You Know Where Your Data Lives?"
description: "A practical nudge to think about what data you actually care about, where it's stored, and how to add one more layer of protection with privacy-focused backups."
publishDate: "2026-03-31"
tags: ["backups", "privacy", "security", "world-backup-day"]
---

It's [World Backup Day](https://www.worldbackupday.com/en), which means it's a good time to ask yourself two questions: what data do I actually care about, and where is it right now?

Not in the abstract. Specifically. Your photos, your documents, your password vault, your tax returns, your notes, your messages. If your laptop died right now, or your phone fell in a lake, or your cloud provider had a catastrophic failure — what would you lose?

Most people have some kind of backup. Maybe Time Machine is running. Maybe iCloud is syncing photos. But very few people have thought carefully about whether their backup strategy actually covers what matters to them, and whether it would survive the scenarios that would actually cause them to need it.

## Start with an inventory

Before you do anything else, sit down and think about what you'd be devastated to lose. For most people, photos are at the top of the list, followed closely by important documents. But it might also be your notes, your messages, your code projects, or your music library.

Now think about where each of those things lives today. Is it only on one device? Is it in a cloud service? Which one? Is it encrypted? Could you access it if you lost your phone and your laptop at the same time?

The goal here isn't to build some enterprise-grade disaster recovery plan. It's much simpler: whatever number of backups you have right now, add one more. If something lives only on your device, get it into a cloud backup. If it's only in one cloud service, get a local copy too. If you already have two independent backups, you're in good shape — go enjoy your day.

## Local backups: Time Machine with encryption

If you're on a Mac, Time Machine is the easiest first line of defence. But there's one setting that a lot of people miss: encryption. When you set up a Time Machine disk, make sure you tick the encrypt option. Without it, anyone who picks up that external drive has full access to everything on it.

Beyond just having a Time Machine backup, think about where that disk lives. If it sits permanently on your desk next to your Mac, a fire or a burglary takes out both your computer and your backup in one go. There are a couple of ways to handle this. You can rotate between two drives — keep one connected and one stored offsite, swapping them periodically. A fireproof safe works too, though make sure it's rated for data storage, not just documents (hard drives are more sensitive to heat than paper). The key point is that at least one copy of your data should be physically separated from your computer.

## iCloud: turn on Advanced Data Protection

If you're in the Apple ecosystem, iCloud is probably already backing up a lot of your data. What many people don't realise is that by default, Apple holds the encryption keys to most of your iCloud data. That means Apple can access it, and so can anyone who compels Apple to hand it over.

[Advanced Data Protection](https://support.apple.com/en-us/108756) changes this. It's Apple's end-to-end encryption option for iCloud, and it covers 25 data categories including iCloud Backup, Photos, Notes, and Messages. With it enabled, your devices hold the encryption keys — not Apple. Even in the event of a cloud breach, your data stays encrypted.

You can enable it in Settings > [your name] > iCloud > Advanced Data Protection. You'll need to set up a recovery contact or recovery key first, because if you lose access to all your devices, Apple won't be able to help you recover your data. That's the trade-off, and it's a worthwhile one.

If you use iCloud for backup at all, turning on Advanced Data Protection is one of the highest-impact privacy improvements you can make with about two minutes of effort.

## Proton Drive: privacy-first cloud backup

If you'd rather not keep your backups with Apple or Google, [Proton Drive](https://proton.me/drive) is a solid alternative. Proton's entire model is built around end-to-end encryption — your files are encrypted on your device before they leave it, and Proton can't read them.

The feature worth highlighting here is photo backup on iOS. The Proton Drive app lets you automatically sync your phone's photo library to Proton's cloud, encrypted end-to-end. You open the app, go to the Photos tab, and turn on backup. It runs over Wi-Fi and handles the rest.

It's not as polished as iCloud Photos — you won't get smart albums or facial recognition — but that's rather the point. Those features require the provider to be able to see your photos. Proton can't, and for a backup use case, that's exactly what you want.

Proton Drive is available on a free tier with limited storage, and paid plans give you more space. If you're already using Proton Mail or Proton VPN, it fits naturally into the same ecosystem.

## Tresorit: zero-knowledge encryption for the security-conscious

[Tresorit](https://tresorit.com) takes a similar approach to Proton but has historically been more focused on file sync and collaboration with strong encryption. It's a zero-knowledge encrypted cloud storage service, meaning Tresorit has no way to access your files. Everything is encrypted client-side before upload.

Tresorit is Swiss-based (like Proton), which matters if jurisdiction is part of your threat model. It's been around since 2011 and has a solid track record. It's particularly strong for syncing folders across devices — think of it as an encrypted Dropbox alternative.

It's not the cheapest option, and it doesn't have the broader ecosystem that Proton offers (email, VPN, calendar). But if your primary concern is encrypted file storage and sync, it does that job very well.

## What if you lose access to the account itself?

There's a failure mode that most backup advice ignores: you don't lose the data, you lose access to the account that holds the data. Your Google account gets locked for a terms of service violation you don't understand. Your Apple ID gets compromised and the attacker changes the password. Your email provider goes out of business. Suddenly your backup is fine — you just can't get to it.

This is worth thinking about separately from backup. If your entire digital life runs through one Google account — email, photos, documents, calendar, contacts, two-factor authentication — then losing that account means losing everything at once. It doesn't matter that Google has excellent uptime and redundancy. The single point of failure isn't Google's infrastructure, it's your access to it.

The mitigations are straightforward. First, make sure your important accounts have recovery options set up — recovery email addresses, recovery phone numbers, recovery keys. Check these now, not when you're locked out. For Google specifically, download your data periodically using [Google Takeout](https://takeout.google.com). For Apple, make sure your recovery contacts and recovery keys are configured, especially if you've enabled Advanced Data Protection.

Second, don't put all your eggs in one basket. If your photos live only in Google Photos, also back them up to Proton Drive or a local disk. If your documents live only in iCloud Drive, sync a copy somewhere else. The point isn't that any one of these services is unreliable — it's that your access to any single account is more fragile than you think, and an independent copy means a lockout is an inconvenience rather than a catastrophe.

## The rule of thumb

Here's the simple version: think about what you'd hate to lose, then make sure it exists in at least two places that could fail independently. Your laptop and your Time Machine drive on the same desk is one failure domain. Your laptop and an encrypted cloud backup is two. Your laptop, a rotated Time Machine drive in a safe, and an end-to-end encrypted cloud backup is three — and at that point you can sleep well.

You don't need to do everything at once. Just add one more layer than you have today. Enable Advanced Data Protection on iCloud. Set up Proton Drive photo backup on your phone. Buy a second Time Machine disk and start rotating. Pick one and do it today — that's the whole point of World Backup Day.

---

*This post was written with the help of [Claude](https://claude.ai).*
