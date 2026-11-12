"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NoteActionState } from "./note-types";

export async function logOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Unable to log out: ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function addNote(
  _previousState: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title");
  const body = formData.get("body");
  const tag = formData.get("tag");

  if (typeof title !== "string" || title.trim().length === 0) {
    return { error: "Please enter a title for your note." };
  }

  if (typeof tag !== "string" || tag.trim().length === 0) {
    return { error: "Please enter a tag for your note." };
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    return { error: "Please enter the note text." };
  }

  const { error } = await supabase
    .from("notes")
    .insert({ title: title.trim(), body: body.trim(), tag: tag.trim() });

  if (error) {
    return { error: "Unable to save the note. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/notes");
  return { success: "Note saved successfully.", successAt: Date.now() };
}

export async function updateNote(
  _previousState: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id");
  const title = formData.get("title");
  const body = formData.get("body");
  const tag = formData.get("tag");

  if (typeof id !== "string" || !/^\d+$/.test(id)) {
    return { error: "This note is no longer available." };
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return { error: "Please enter a title for your note." };
  }

  if (typeof tag !== "string" || tag.trim().length === 0) {
    return { error: "Please enter a tag for your note." };
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    return { error: "Please enter the note text." };
  }

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: title.trim(),
      body: body.trim(),
      tag: tag.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: "Unable to save changes. Please try again." };
  }

  if (!data) {
    return { error: "This note is no longer available." };
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  return { success: "Note updated successfully.", successAt: Date.now() };
}

export async function deleteNote(
  _previousState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id");

  if (typeof id !== "string" || !/^\d+$/.test(id)) {
    return { error: "This note is no longer available." };
  }

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: "Unable to delete the note. Please try again." };
  }

  if (!data) {
    return { error: "This note is no longer available." };
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect("/notes");
}
