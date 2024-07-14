import DaggerLoading from '../svg/DaggerLoading'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='loading'>
      {/* <img src='/images/dagger_with_transparent_background.png' alt='loading' /> */}
      <DaggerLoading />
    </div>
  )
}
