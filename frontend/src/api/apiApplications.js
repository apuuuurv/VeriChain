import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) {
    console.error("Error Uploading Resume:", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  let certificateUrl = null;
  if (jobData.certificates) {
    const certificateFileName = `certificate-${random}-${jobData.candidate_id}`;
    const { error: certificateStorageError } = await supabase.storage
      .from("certificates")
      .upload(certificateFileName, jobData.certificates);
      
    if (certificateStorageError) {
      console.error("Error Uploading Certificate:", certificateStorageError);
      // Continue with application even if certificate upload fails
    } else {
      certificateUrl = `${supabaseUrl}/storage/v1/object/public/certificates/${certificateFileName}`;
    }
  }

  const applicationData = {
    ...jobData,
    resume,
    certificates: certificateUrl
  };

  const { data, error } = await supabase
    .from("applications")
    .insert([applicationData])
    .select();

  if (error) {
    console.error("Error Submitting Application:", error);
    return null;
  }

  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error Fetching Applications:", error);
    return null;
  }

  return data;
}
