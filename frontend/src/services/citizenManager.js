import supabase from '../utils/supabaseClient';

export async function handleCitizen() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error retrieving user:', userError);
    return;
  }

  const email = user.email;
  if (!email) {
    console.error('User has no email. Cannot continue.');
    return;
  }

  // Fetch existing citizen by email
  const { data: existingCitizen, error: selectError } = await supabase
    .from('citizens')
    .select('*')
    .eq('email', email)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error fetching citizen:', selectError);
    return;
  }

  // Determine full name from metadata (fallback to 'Anonymous')
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    'Anonymous';

  // Determine Google ID if available
  const googleId = user.user_metadata?.sub || null;

  // Determine auth provider photo URL
  const authPhotoUrl = user.user_metadata?.picture || null;

  if (!existingCitizen) {
    // INSERT new citizen
    const { error: insertError } = await supabase
      .from('citizens')
      .insert({
        id: user.id,
        email: email,
        full_name: fullName,
        auth_provider: user.app_metadata?.provider || 'email',
        google_id: googleId,
        profile_photo_url: null,
        auth_provider_photo_url: authPhotoUrl,
        phone: null,
        city: null,
        state: null,
        zip_code: null,
        created_at: new Date(),
        updated_at: new Date()
      });

    if (insertError) {
      console.error('Error inserting citizen:', insertError);
    } else {
      console.log('Citizen created successfully.');
    }
    return;
  }

  // UPDATE existing citizen: only if default/null values
  const updatedData = {};

  if (existingCitizen.full_name === 'Anonymous' && fullName !== 'Anonymous') {
    updatedData.full_name = fullName;
  }
  if (!existingCitizen.google_id && googleId) {
    updatedData.google_id = googleId;
  }
  if (!existingCitizen.auth_provider_photo_url && authPhotoUrl) {
    updatedData.auth_provider_photo_url = authPhotoUrl;
  }

  // Always update auth_provider to latest provider
  updatedData.auth_provider = user.app_metadata?.provider || 'email';
  updatedData.updated_at = new Date();

  if (Object.keys(updatedData).length > 0) {
    const { error: updateError } = await supabase
      .from('citizens')
      .update(updatedData)
      .eq('email', email);

    if (updateError) {
      console.error('Error updating citizen:', updateError);
    } else {
      console.log('Citizen updated successfully.');
    }
  } else {
    console.log('No updates needed for citizen.');
  }
}
