export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product: any) => {
    if (!import.meta.client) return

    try {
      const saved = localStorage.getItem('recentlyViewed')
      let items = saved ? JSON.parse(saved) : []
      
      // Remove if already exists
      items = items.filter((item: any) => item.id !== product.id)
      
      // Add to beginning with timestamp
      items.unshift({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.image,
        price: product.final_price || product.price,
        viewedAt: new Date().toISOString()
      })
      
      // Keep only last 20 items
      items = items.slice(0, 20)
      
      localStorage.setItem('recentlyViewed', JSON.stringify(items))
    } catch (e) {
      console.error('Failed to add to recently viewed:', e)
    }
  }

  const getRecentlyViewed = () => {
    if (!import.meta.client) return []

    try {
      const saved = localStorage.getItem('recentlyViewed')
      if (!saved) return []
      
      const items = JSON.parse(saved)
      
      // Add friendly time labels
      return items.map((item: any) => ({
        ...item,
        viewedAt: formatViewTime(item.viewedAt)
      }))
    } catch (e) {
      console.error('Failed to get recently viewed:', e)
      return []
    }
  }

  const formatViewTime = (isoDate: string) => {
    const date = new Date(isoDate)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return {
    addToRecentlyViewed,
    getRecentlyViewed
  }
}
