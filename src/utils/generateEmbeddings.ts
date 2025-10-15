export const generateEmbeddings = async (supabaseUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const apiUrl = `${supabaseUrl}/functions/v1/generate-embeddings`;

    console.log('Calling generate-embeddings function...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to generate embeddings:', error);
      return {
        success: false,
        message: `Failed to generate embeddings: ${error}`,
      };
    }

    const result = await response.json();
    console.log('Embeddings generated:', result);

    return {
      success: true,
      message: `Successfully generated embeddings for ${result.success || 0} programs`,
    };
  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    return {
      success: false,
      message: error.message || 'Failed to generate embeddings',
    };
  }
};
