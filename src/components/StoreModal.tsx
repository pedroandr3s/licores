'use client';

import { useUI } from '@/context/UIContext';
import { useStore } from '@/context/StoreContext';
import { getStore } from '@/data/stores';
import Modal from './ui/Modal';
import StoreSelector from './StoreSelector';

export default function StoreModal() {
  const { storeModalOpen, closeStoreModal, toast } = useUI();
  const { selectedStoreId, dispatch } = useStore();
  return (
    <Modal open={storeModalOpen} onClose={closeStoreModal} title="Elige tu tienda" description="Verás la disponibilidad y podrás retirar tus compras ahí." size="md">
      <div className="p-5 sm:p-6">
        <StoreSelector
          value={selectedStoreId}
          name="header-store"
          onChange={(id) => {
            dispatch({ type: 'SET_STORE', storeId: id });
            toast({ type: 'success', title: 'Tienda seleccionada', description: getStore(id)?.name });
            closeStoreModal();
          }}
        />
      </div>
    </Modal>
  );
}
