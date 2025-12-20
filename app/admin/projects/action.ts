
'use server'; 

import { revalidatePath } from 'next/cache';


export async function deleteProjectAction(id: string) {
  try {
    
    
    console.log(`Deleting project with id: ${id}`);

    
    revalidatePath('/admin/projects'); 
  } catch (error) {
    throw new Error('Failed to delete project');
  }
}