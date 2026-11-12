# Secure Notes

A private notes app for tutors. Email/password authentication is provided by
Supabase Auth, and database row-level security ensures each tutor can access
only their own notes. Notes can be organized with tags and searched by title or
tag.

The collection has its own page, and the note editor supports bold and
underlined text, headings, numbered or bulleted lists, and text alignment.

## Set up Supabase

1. For a new project, run [`db/schema.sql`](./db/schema.sql) in the Supabase SQL
   Editor. For an existing project, run
   [`db/migrations/20261112_add_note_tags.sql`](./db/migrations/20261112_add_note_tags.sql)
   to add tags without recreating the notes table.
2. Turn off email confirmation in Supabase Auth if accounts should be able to
   sign in immediately after signing up.
3. Add the Supabase project URL and publishable key to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   The app uses the publishable key with the signed-in user's session. Do not
   use a service-role key or a database password.

4. To enable Google sign-in, enable the Google provider under Supabase Auth >
   Providers and enter the OAuth client ID and secret from Google Cloud.
   In Supabase Auth > URL Configuration, allow the local and deployed callback
   URLs (`http://localhost:3000/auth/callback**` and
   `https://your-domain.com/auth/callback**`). Add the callback URL shown by
   Supabase to the authorized redirect URIs in Google Cloud.
5. Password recovery uses the same callback. Keep the local and deployed
   callback URLs in Supabase's allowed redirect URLs so reset emails can return
   to `/reset-password`.

The login page can remember an email on this device when the user opts in.
Passwords are never stored by the app; users can save them with their browser's
password manager.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For deployment, configure the same two environment variables in the hosting
provider and deploy the app. Keep email confirmation settings consistent with
the desired sign-up flow.
